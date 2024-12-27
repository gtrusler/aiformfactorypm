import type { Stripe } from "stripe";
import { stripe } from "@/app/utils/stripe";
import {
  upsertSubscription,
  addCreditsToCustomer,
} from "@/app/utils/stripe-supabase-admin";
import config from "@/config";

const relevantEvents = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "checkout.session.completed",
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
  } catch (err) {
    console.log(`❌ Error message: ${err instanceof Error ? err.message : ""}`);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 }
    );
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.mode === "payment" && session.payment_status === "paid") {
            const expandedSession = await stripe.checkout.sessions.retrieve(
              session.id,
              {
                expand: ["line_items.data.price"],
              }
            );

            if (!expandedSession.line_items?.data[0]?.price?.id) {
              throw new Error("Missing price information in session");
            }

            const priceId = expandedSession.line_items.data[0].price.id;
            const customerId = session.customer as string;
            const plan = config.stripe.plans.find(
              (price) => price.priceId === priceId
            );

            if (!plan) {
              throw new Error(`No plan found for price ID: ${priceId}`);
            }

            await addCreditsToCustomer(plan, customerId);
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          await upsertSubscription(
            subscription.id,
            subscription.customer as string
          );
          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as Stripe.Invoice;
          if (invoice.billing_reason === "subscription_create") {
            const subscription = invoice.subscription as string;
            const paymentIntent = invoice.payment_intent as string;

            try {
              const intent = await stripe.paymentIntents.retrieve(
                paymentIntent
              );
              await stripe.subscriptions.update(subscription, {
                default_payment_method: intent.payment_method as string,
              });
              console.log(
                "Default payment method set for subscription:" +
                  intent.payment_method
              );
            } catch (err) {
              console.log(err);
              console.log(
                `⚠️  Failed to update the default payment method for subscription: ${subscription}`
              );
            }
          }
          break;
        }

        case "invoice.payment_failed":
        case "invoice.finalized":
          // Handle these cases if needed
          break;

        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      return new Response(
        "Webhook handler failed. View your nextjs function logs.",
        { status: 400 }
      );
    }
  }

  return new Response(JSON.stringify({ received: true }));
}

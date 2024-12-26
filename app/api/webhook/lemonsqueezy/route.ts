import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import config from "@/config";
import { addPlanToCustomer } from "@/app/utils/lemon-squeezy-supabase-admin";
import type { Plan } from "@/types/plans";

interface LemonSqueezyWebhookEvent {
  meta: {
    custom_data: {
      user_id: string;
    };
    event_name: string;
  };
  data: {
    attributes: {
      variant_id: number;
      status: string;
    };
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const event = body as LemonSqueezyWebhookEvent;

    if (event.meta.event_name === "subscription_created") {
      const variantId = event.data.attributes.variant_id;
      const userId = event.meta.custom_data.user_id;
      const plan = config.lemonsqueezy.plans.find(
        (p: Plan) => p.variantId === variantId
      );

      if (!plan) {
        throw new Error(`No plan found for variant ID: ${variantId}`);
      }

      await addPlanToCustomer(plan, userId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

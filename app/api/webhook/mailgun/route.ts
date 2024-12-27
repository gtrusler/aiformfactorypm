import { NextResponse, NextRequest } from "next/server";
import { sendEmail } from "@/libs/mailgun";
import config from "@/config";

// This route is used to receive emails from Mailgun and forward them to our customer support email.
// See more: https://nextstarter.ai/docs/features/email
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // extract the email content, subject and sender
    const formData = await request.formData();
    const sender = formData.get("From");
    const subject = formData.get("Subject");
    const html = formData.get("body-html");

    // send email to the admin if forwardRepliesTo is et & emailData exists
    if (config.mailgun.forwardRepliesTo && html && subject && sender) {
      await sendEmail({
        to: config.mailgun.forwardRepliesTo,
        subject: `${config?.appName} | ${subject}`,
        html: `<div><p><b>- Subject:</b> ${subject}</p><p><b>- From:</b> ${sender}</p><p><b>- Content:</b></p><div>${html}</div></div>`,
        replyTo: String(sender),
      });
    }

    return NextResponse.json({});
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

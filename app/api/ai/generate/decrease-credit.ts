import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function decreaseCredit(): Promise<void> {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("No session found");
    }

    const { error } = await supabase.rpc("add_credits", {
      x: -1,
      user_id: session.user.id,
    });

    if (error) {
      console.error("Error decreasing credits:", error);
      throw error;
    }

    console.log("1 credit decreased from user:", session.user.id);
  } catch (error) {
    console.error("Failed to decrease credit:", error);
    throw error;
  }
}

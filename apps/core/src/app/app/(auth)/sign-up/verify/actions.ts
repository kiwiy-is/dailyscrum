"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function verify(email: string, code: string, returnPath?: string) {
  const cookieStore = cookies();

  const authClient = createAuthClient(cookieStore);
  const client = createClient();

  const verificationResponse = await authClient.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (verificationResponse.error || !verificationResponse.data.user) {
    return {
      error: {
        message: verificationResponse.error?.message,
      },
    };
  }

  const { user } = verificationResponse.data;

  const { data: profile } = await client
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  const isSignUpFlow = !Boolean(profile);

  if (isSignUpFlow) {
    // TODO: redirect on client side
    redirect(
      `/app/onboard/create-profile${
        returnPath ? `?return-path=${encodeURIComponent(returnPath)}` : ""
      }`
    );
  }

  if (!returnPath) {
    // TODO: redirect on client side
    redirect("/app");
  }
  // TODO: redirect on client side
  redirect(returnPath);
}

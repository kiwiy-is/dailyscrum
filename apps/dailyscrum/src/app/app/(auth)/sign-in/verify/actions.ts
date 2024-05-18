"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function verify(email: string, code: string, returnPath?: string) {
  const cookieStore = cookies();

  const authClient = createAuthClient(cookieStore);

  const verificationResponse = await authClient.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (verificationResponse.error || !verificationResponse.data.user) {
    return verificationResponse;
  }

  if (!returnPath) {
    // TODO: do redirection works on client side
    redirect("/app");
  }
  // TODO: do redirection works on client side
  redirect(returnPath);
}

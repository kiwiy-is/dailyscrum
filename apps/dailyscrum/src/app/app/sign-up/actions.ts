"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(email: string, returnPath?: string) {
  const headerList = headers();

  const origin = headerList.get("origin");

  const cookieStore = cookies();
  const authClient = createAuthClient(cookieStore);
  const { error } = await authClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/app/auth/confirm${
        returnPath ? `?return-path=${encodeURIComponent(returnPath)}` : ""
      }`,
    },
  });

  if (error) {
    return {
      error: error,
    };
  }

  redirect("/app/sign-up/check-email");
}

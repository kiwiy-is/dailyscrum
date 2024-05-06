"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies, headers } from "next/headers";

export async function signUp(email: string, returnPath?: string) {
  const headerList = headers();

  const origin = headerList.get("origin");

  const cookieStore = cookies();
  const authClient = createAuthClient(cookieStore);

  return await authClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/app/auth/confirm${
        returnPath ? `?return-path=${encodeURIComponent(returnPath)}` : ""
      }`,
    },
  });
}

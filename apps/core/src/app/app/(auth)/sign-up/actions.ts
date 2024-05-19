"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies, headers } from "next/headers";

export async function signUp(email: string, returnPath?: string) {
  const headerList = headers();

  const protocol = headerList.get("x-forwarded-proto");
  const hostname = headerList.get("x-forwarded-host");

  const origin = `${protocol}://${hostname}`;

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

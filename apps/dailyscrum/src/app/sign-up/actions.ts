"use server";

import {
  createOrgWhereCurrentUserIsMember,
  getCurrentUser,
  initializeOrg,
} from "@/lib/services";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signUp(email: string) {
  const headerList = headers();

  const origin = headerList.get("origin");

  const cookieStore = cookies();
  const authClient = createAuthClient(cookieStore);
  const { error } = await authClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/sign-up/confirm`,
    },
  });

  if (error) {
    return {
      error: error,
    };
  }

  return redirect("/sign-up/check-email");
}

export async function completeSignUp(name: string) {
  const client = createClient<Database>();

  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    return { error: getCurrentUserError };
  }

  if (!user) {
    return { error: { message: "User not found" } };
  }

  const { data: profile, error: insertProfileError } = await client
    .from("profiles")
    .insert({
      id: user.id,
      name,
    })
    .select("*")
    .single();

  if (insertProfileError || !profile) {
    return { error: insertProfileError };
  }

  const { data: org, error: createOrgError } =
    await createOrgWhereCurrentUserIsMember({
      name: "My organization",
    });

  if (createOrgError) {
    return { error: createOrgError };
  }

  const { error: initializeOrgError } = await initializeOrg(org.id);

  if (initializeOrgError) {
    return { error: initializeOrgError };
  }

  return redirect("/");
}

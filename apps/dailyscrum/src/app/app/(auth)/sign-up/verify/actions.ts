"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { createClient } from "@/lib/supabase/client";
import { setUpWorkspaceForCurrentUser } from "@/services/workspaces";
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
    return verificationResponse;
  }

  const { user } = verificationResponse.data;

  const { data: profile } = await client
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  const isSignUpFlow = !Boolean(profile);

  if (isSignUpFlow) {
    // NOTE: sign up flow
    const [emailUserName] = user.email ? user.email?.split("@") : [user.id];
    await client.from("profiles").insert({
      id: user.id,
      name: emailUserName,
    });

    await setUpWorkspaceForCurrentUser({
      name: "My workspace",
    });

    if (returnPath) {
      // TODO: redirect on client side
      redirect(returnPath);
    }

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

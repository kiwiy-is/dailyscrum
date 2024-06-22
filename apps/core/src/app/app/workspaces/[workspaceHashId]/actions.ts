"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { setUpWorkspaceForCurrentUser } from "@/services/workspaces";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUserProfile, updateProfile } from "@/services/profiles";

export async function createNewWorkspace(name: string, timeZone: string) {
  return setUpWorkspaceForCurrentUser({ name }, timeZone);
}

export async function signOut() {
  const authClient = createAuthClient(cookies());
  await authClient.auth.signOut();
  redirect("/app");
}

export async function updateName(name: string) {
  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (getProfileError) {
    return {
      error: getProfileError,
    };
  }

  const response = await updateProfile({
    name,
  });

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  return {
    data: response.data.name,
  };
}

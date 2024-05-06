"use server";

import { createProfile, getCurrentUserProfile } from "@/services/profiles";

export async function completeSignUp(name: string, returnPath?: string) {
  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (profile) {
    return {
      data: null,
      error: {
        message: "Profile already exists",
      },
    };
  }

  return createProfile({
    name,
  });
}

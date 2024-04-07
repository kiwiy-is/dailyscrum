"use server";

import { redirect } from "next/navigation";
import { createProfile, getCurrentUserProfile } from "@/services/profiles";

export async function completeSignUp(name: string, returnPath?: string) {
  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (profile) {
    redirect(returnPath ? returnPath : "/daily-scrum");
  }

  const { data: newProfile, error: insertNewProfileError } =
    await createProfile({
      name,
    });

  if (insertNewProfileError) {
    return { error: insertNewProfileError };
  }

  if (!newProfile) {
    return {
      error: {
        message: "Error creating profile",
      },
    };
  }

  redirect(returnPath ? returnPath : "/daily-scrum");
}

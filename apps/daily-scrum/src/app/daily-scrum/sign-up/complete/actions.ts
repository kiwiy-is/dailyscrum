"use server";

import { redirect } from "next/navigation";
import { createProfile, getCurrentUserProfile } from "@/services/profiles";

export async function completeSignUp(name: string) {
  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (profile) {
    redirect("/daily-scrum/redirect?to=/daily-scrum");
  }

  const { data: newProfile, error: insertNewProfileError } =
    await createProfile({
      name,
    });

  if (insertNewProfileError || !newProfile) {
    return { error: insertNewProfileError };
  }

  redirect("/daily-scrum/redirect?to=/daily-scrum");
}

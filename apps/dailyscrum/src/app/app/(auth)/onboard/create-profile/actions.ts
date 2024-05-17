"use server";

import { updateProfile } from "@/services/profiles";

export async function completeSignUp(name: string) {
  return updateProfile({
    name,
  });
}

"use server";

import { updateProfile } from "@/services/profiles";

export async function completeSignUp(name: string, returnPath?: string) {
  return updateProfile({
    name,
  });
}

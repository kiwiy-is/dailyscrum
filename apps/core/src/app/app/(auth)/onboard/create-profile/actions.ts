"use server";

import { createProfile } from "@/services/profiles";

export async function completeSignUp(name: string) {
  return createProfile({
    name,
  });
}

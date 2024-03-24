"use server";

import { getCurrentUser } from "@/lib/services";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { redirect } from "next/navigation";

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

  const { data: profile, error: getProfileError } = await client
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (profile) {
    return redirect("/redirect?to=/");
  }

  const { data: newProfile, error: insertNewProfileError } = await client
    .from("profiles")
    .insert({
      id: user.id,
      name,
    })
    .select("*")
    .single();

  if (insertNewProfileError || !newProfile) {
    return { error: insertNewProfileError };
  }

  return redirect("/redirect?to=/");
}

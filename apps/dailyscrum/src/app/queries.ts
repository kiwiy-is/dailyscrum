import { getCurrentUser } from "@/lib/services";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export async function getCurrentUserProfile() {
  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      data: null,
      error: getCurrentUserError,
    };
  }

  if (!user) {
    return {
      data: null,
      error: {
        message: "User not found",
      },
    };
  }

  const client = createClient<Database>();

  return client.from("profiles").select("*").eq("id", user.id).single();
}

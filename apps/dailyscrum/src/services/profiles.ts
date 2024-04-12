import { getCurrentUser } from "@/services/users";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { cache } from "react";
import { memoize } from "@/lib/cache";

export const getCurrentUserProfile = cache(async () => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

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

  return getProfile(user.id);
});

const getProfile = memoize(async (userId: string) => {
  const client = createClient<Database>();

  return client.from("profiles").select().eq("id", userId).single();
});

export const createProfile = async (
  profileValues: Required<
    Pick<Database["public"]["Tables"]["profiles"]["Insert"], "name">
  >
) => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

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

  const response = await client
    .from("profiles")
    .insert({
      id: user.id,
      name: profileValues.name,
    })
    .select("*")
    .single();

  if (response.error) {
    return response;
  }

  return response;
};

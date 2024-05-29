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
  const client = createClient();

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

  const client = createClient();

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

export const updateProfile = async (
  profileValues: Omit<Database["public"]["Tables"]["profiles"]["Update"], "id">
) => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

  if (getCurrentUserError || !user) {
    return {
      data: null,
      error: getCurrentUserError,
    };
  }

  const client = createClient();
  return client
    .from("profiles")
    .update(profileValues)
    .eq("id", user.id)
    .select()
    .single();
};

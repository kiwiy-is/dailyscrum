import { cache } from "react";
import { createAuthClient } from "../lib/supabase/auth-client";
import { cookies } from "next/headers";
import { AuthError, User } from "@supabase/supabase-js";

export const getCurrentUser = cache(async () => {
  const authClient = createAuthClient(cookies());
  const response = await authClient.auth.getUser();

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  if (!response.data.user) {
    return {
      data: null,
      error: new AuthError("User not found"),
    };
  }

  return {
    data: response.data.user,
    error: null,
  };
});

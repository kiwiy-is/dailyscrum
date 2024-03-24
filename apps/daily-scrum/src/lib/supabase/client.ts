"server-only";

import {
  createClient as supabaseJsCreateClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

// Restrict the client to not allow access to the auth property.
// If you need to access the auth property, use createAuthClient instead.
type SupabaseClientRestricted<T> = Omit<SupabaseClient<T>, "auth">;

export function createClient<T>(): SupabaseClientRestricted<T> {
  const client = supabaseJsCreateClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  // Create a proxy to filter out the auth property
  const proxy = new Proxy(client, {
    get(target, prop, receiver) {
      if (prop === "auth") {
        throw new Error("Access to client.auth is restricted");
      }
      return Reflect.get(target, prop, receiver);
    },
  });

  return proxy as SupabaseClientRestricted<T>;
}

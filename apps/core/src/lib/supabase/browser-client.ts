"client-only";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { Database } from "./database";

export function createBrowserClient() {
  const client = createSupabaseBrowserClient<Database, "daily_scrum">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: {
        schema: "daily_scrum",
      },
      cookies: {},
    }
  );

  return client;
}

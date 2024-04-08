import { memoizeAndPersist } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getOrgSettings = memoizeAndPersist(async (orgId: number) => {
  const client = createClient<Database>();

  return client.from("org_settings").select("*").eq("org_id", orgId);
}, "getOrgSettings");

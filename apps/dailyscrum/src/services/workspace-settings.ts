import { memoizeAndPersist } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getWorkspaceSettings = memoizeAndPersist(
  async (workspaceId: number) => {
    const client = createClient<Database>();

    return client
      .from("workspace_settings")
      .select("*")
      .eq("workspace_id", workspaceId);
  },
  "getWorkspaceSettings"
);

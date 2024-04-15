import { memoize } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getWorkspaceSettings = memoize(async (workspaceId: number) => {
  const client = createClient<Database>();

  return client
    .from("workspace_settings")
    .select("*")
    .eq("workspace_id", workspaceId);
});

export const updateWorkspaceTimeZone = async (
  workspaceId: number,
  timeZone: string
) => {
  const client = createClient();
  return client
    .from("workspace_settings")
    .update({ attribute_value: timeZone })
    .match({
      attribute_key: "time_zone",
      workspace_id: workspaceId,
    })
    .select()
    .single();
};

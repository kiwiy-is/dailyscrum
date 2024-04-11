import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { memoizeAndPersist } from "@/lib/cache";

/**
 * Retrieves and lists daily scrum update form ids for a specific workspace.
 *
 * @param {number} workspaceId - The ID of the workspace to retrieve form ids for.
 */
export const listDailyScrumUpdateFormIdsOfWorkspace = memoizeAndPersist(
  async (workspaceId: number) => {
    const client = createClient<Database>();

    return client
      .from("daily_scrum_update_forms")
      .select("id")
      .eq("workspace_id", workspaceId);
  },
  "listDailyScrumUpdateFormIdsOfWorkspace"
);

export const getDailyScrumUpdateForm = memoizeAndPersist(
  async (formId: number) => {
    const client = createClient<Database>();

    return client
      .from("daily_scrum_update_forms")
      .select("*, dailyScrumUpdateQuestions:daily_scrum_update_questions(*)")
      .eq("id", formId)
      .single();
  },
  "getDailyScrumUpdateForm"
);

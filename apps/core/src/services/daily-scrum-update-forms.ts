import { createClient } from "@/lib/supabase/client";
import { memoize } from "@/lib/cache";

/**
 * Retrieves and lists daily scrum update form ids for a specific workspace.
 *
 * @param {number} workspaceId - The ID of the workspace to retrieve form ids for.
 */
export const listDailyScrumUpdateFormIdsOfWorkspace = memoize(
  async (workspaceId: number) => {
    const client = createClient();

    return client
      .from("daily_scrum_update_forms")
      .select("id")
      .eq("workspace_id", workspaceId);
  }
);

export const getDailyScrumUpdateForm = memoize(async (formId: number) => {
  const client = createClient();

  return client
    .from("daily_scrum_update_forms")
    .select("*, dailyScrumUpdateQuestions:daily_scrum_update_questions(*)")
    .eq("id", formId)
    .single();
});

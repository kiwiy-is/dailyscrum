import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { memoizeAndPersist } from "@/lib/cache";

/**
 * Retrieves and lists daily scrum update form ids for a specific organization.
 *
 * @param {number} orgId - The ID of the organization to retrieve form ids for.
 */
export const listDailyScrumUpdateFormIdsOfOrg = memoizeAndPersist(
  async (orgId: number) => {
    const client = createClient<Database>();

    return client
      .from("daily_scrum_update_forms")
      .select("id")
      .eq("org_id", orgId);
  },
  "listDailyScrumUpdateFormIdsOfOrg"
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

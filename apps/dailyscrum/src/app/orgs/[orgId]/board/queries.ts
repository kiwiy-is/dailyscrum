import { getOrgByHashId } from "@/lib/services";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { unstable_cache } from "next/cache";

/**
 * Retrieves and lists daily scrum update form ids for a specific organization.
 *
 * @param {number} orgId - The ID of the organization to retrieve form ids for.
 */
async function listDailyScrumUpdateFormIdsOfOrg(orgId: number) {
  const client = createClient<Database>();

  return unstable_cache(
    async () => {
      return client
        .from("daily_scrum_update_forms")
        .select("id")
        .eq("org_id", orgId);
    },
    [`daily-scrum-update-form-ids-of-org-${orgId}`],
    {
      tags: [`daily-scrum-update-form-ids-of-org-${orgId}`],
      revalidate: false,
    }
  )();
}

/**
 * Retrieves and lists daily scrum update entries based on the organization hash ID and date.
 *
 * @param {string} orgHashId - The hash ID of the organization
 * @param {string} date - The ISO formatted date string. e.g. 2024-03-17
 */
export async function listDailyScrumUpdateEntries(
  orgHashId: string,
  date: string
) {
  const { data: org, error: getOrgError } = await getOrgByHashId(orgHashId);

  if (getOrgError || !org) {
    return {
      data: null,
      error: getOrgError,
    };
  }

  const client = createClient<Database>();

  const { data: dailyScrumUpdateForms, error: getDailyScrumUpdateFormsError } =
    await listDailyScrumUpdateFormIdsOfOrg(org.id);

  if (getDailyScrumUpdateFormsError || !dailyScrumUpdateForms) {
    return {
      data: null,
      error: getDailyScrumUpdateFormsError,
    };
  }

  return unstable_cache(
    async () => {
      return client
        .from("daily_scrum_update_entries")
        .select(
          "*, daily_scrum_update_answers(*, daily_scrum_update_question:daily_scrum_update_questions(*))"
        )
        .eq("date", date)
        .eq(
          "daily_scrum_update_form_id",
          dailyScrumUpdateForms.map(
            // TODO: check when multiple form exists
            (dailyScrumUpdateForm) => dailyScrumUpdateForm.id
          )
        );
    },
    [`list-daily-scrum-update-entries-${orgHashId}-${date}`],
    {
      tags: [`list-daily-scrum-update-entries-${orgHashId}-${date}`],
      revalidate: false,
    }
  )();
}

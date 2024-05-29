import { cache } from "react";
import { getCurrentUser } from "./users";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { getWorkspaceByHashId } from "./workspaces";
import { listDailyScrumUpdateFormIdsOfWorkspace } from "./daily-scrum-update-forms";
import { memoize } from "@/lib/cache";

/**
 * Retrieves and lists daily scrum update entries based on the workspace hash ID and date.
 *
 * @param {string} workspaceHashId - The hash ID of the workspace
 * @param {string} date - The ISO formatted date string. e.g. 2024-03-17
 */
export const listDailyScrumUpdateEntries = memoize(
  async (workspaceHashId: string, date: string) => {
    const { data: workspace, error: getWorkspaceError } =
      await getWorkspaceByHashId(workspaceHashId);

    if (getWorkspaceError || !workspace) {
      return {
        data: null,
        error: getWorkspaceError,
      };
    }

    const client = createClient();

    const {
      data: dailyScrumUpdateForms,
      error: getDailyScrumUpdateFormsError,
    } = await listDailyScrumUpdateFormIdsOfWorkspace(workspace.id);

    if (getDailyScrumUpdateFormsError || !dailyScrumUpdateForms) {
      return {
        data: null,
        error: getDailyScrumUpdateFormsError,
      };
    }

    return client
      .from("daily_scrum_update_entries")
      .select(
        `
      *,
      user:users(id, profile:profiles(name)),
      daily_scrum_update_answers(
        *,
        daily_scrum_update_question:daily_scrum_update_questions(*)
      )
      `
      )
      .gte("date", date)
      .lte("date", date)
      .in(
        "daily_scrum_update_form_id",
        dailyScrumUpdateForms.map(
          (dailyScrumUpdateForm) => dailyScrumUpdateForm.id
        )
      );
  }
);

export const getDailyScrumUpdateEntry = memoize(
  async (updateEntryId: number) => {
    const client = createClient();

    return client
      .from("daily_scrum_update_entries")
      .select(
        `
          *,
          user:users(id, profile:profiles(name)),
          daily_scrum_update_form:daily_scrum_update_forms(*),
          daily_scrum_update_answers(
            *,
            daily_scrum_update_question:daily_scrum_update_questions(*)
          )
        `
      )
      .eq("id", updateEntryId)
      .single();
  }
);

const getDailyScrumUpdateEntriesCount = memoize(
  async (userId: string, formId: number, date: string) => {
    const client = createClient();

    return client
      .from("daily_scrum_update_entries")
      .select("*", { count: "exact", head: true })
      .eq("daily_scrum_update_form_id", formId)
      .gte("date", date)
      .lte("date", date)
      .eq("submitted_user_id", userId);
  }
);

export const getDailyScrumUpdateEntriesCountOfCurrentUser = cache(
  async (formId: number, date: string) => {
    const { data: user, error: getCurrentUserError } = await getCurrentUser();

    if (getCurrentUserError) {
      return {
        data: null,
        count: null,
        error: getCurrentUserError,
      };
    }

    return getDailyScrumUpdateEntriesCount(user.id, formId, date);
  }
);

export const createDailyScrumUpdateEntry = async (
  workspaceHashId: string,
  entryValues: Required<
    Pick<
      Database["daily_scrum"]["Tables"]["daily_scrum_update_entries"]["Insert"],
      "daily_scrum_update_form_id" | "date" | "time_zone"
    >
  >
) => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      data: null,
      error: getCurrentUserError,
    };
  }

  const client = createClient();

  const response = await client
    .from("daily_scrum_update_entries")
    .insert({
      ...entryValues,
      submitted_user_id: user.id,
    })
    .select("*")
    .single();

  if (response.error) {
    return response;
  }

  return response;
};

export const deleteDailyScrumUpdateEntry = async (entryId: number) => {
  const client = createClient();

  return client.from("daily_scrum_update_entries").delete().eq("id", entryId);
};

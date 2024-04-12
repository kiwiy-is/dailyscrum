"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { createWorkspace } from "@/services/workspaces";
import { cookies } from "next/headers";
import { getParams } from "next-impl-getters/get-params";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { createDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import { createDailyScrumUpdateAnswers } from "@/services/daily-scrum-update-answers";

export async function createNewWorkspace(name: string) {
  const { data: workspace, error } = await createWorkspace({ name });

  if (error) {
    return {
      error,
    };
  }

  redirect(`/app/workspaces/${workspace.hash_id}`);
}

// TODO: Move this to /board page actions
export async function addUpdate(
  formId: number,
  timeZone: string,
  formValues: {
    [x: number]: string;
  } & { date: Date }
) {
  const { workspaceHashId } = getParams() as {
    workspaceHashId: string;
  };

  const { date, ...dynamicFormValues } = formValues;

  const dateString = DateTime.fromJSDate(date).toISODate();

  if (!dateString) {
    return {
      error: {
        message: "Invalid date",
      },
    };
  }

  const { data: entry, error: insertDailyScrumUpdateEntryError } =
    await createDailyScrumUpdateEntry(workspaceHashId, {
      daily_scrum_update_form_id: formId,
      date: dateString,
      time_zone: timeZone,
    });

  if (insertDailyScrumUpdateEntryError) {
    return {
      error: insertDailyScrumUpdateEntryError,
    };
  }

  const { error: createDailyScrumUpdateAnswersError } =
    await createDailyScrumUpdateAnswers(
      entry.id,
      Object.entries(dynamicFormValues).map(([key, value]) => ({
        daily_scrum_update_question_id: parseInt(key, 10),
        answer: value,
      }))
    );

  if (createDailyScrumUpdateAnswersError) {
    return {
      error: createDailyScrumUpdateAnswersError,
    };
  }

  return {
    error: null,
  };
}

export async function signOut() {
  const authClient = createAuthClient(cookies());
  await authClient.auth.signOut();
  redirect("/app/sign-in");
}

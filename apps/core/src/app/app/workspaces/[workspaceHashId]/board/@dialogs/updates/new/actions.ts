"use server";

import { createDailyScrumUpdateAnswers } from "@/services/daily-scrum-update-answers";
import { createDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";

export async function addUpdate(
  workspaceHashId: string,
  formId: number,
  timeZone: string,
  formValues: {
    [x: number]: string;
  } & {
    date: string;
  }
) {
  const { date, ...dynamicFormValues } = formValues;

  if (!date) {
    return {
      error: {
        message: "Invalid date",
      },
    };
  }

  const { data: entry, error: insertDailyScrumUpdateEntryError } =
    await createDailyScrumUpdateEntry(workspaceHashId, {
      daily_scrum_update_form_id: formId,
      date,
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

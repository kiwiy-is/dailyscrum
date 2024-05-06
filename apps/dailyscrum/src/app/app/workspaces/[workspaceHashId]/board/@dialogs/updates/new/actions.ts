"use server";

import { createDailyScrumUpdateAnswers } from "@/services/daily-scrum-update-answers";
import { createDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import { DateTime } from "luxon";

export async function addUpdate(
  workspaceHashId: string,
  formId: number,
  timeZone: string,
  formValues: {
    [x: number]: string;
  } & { date: Date }
) {
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

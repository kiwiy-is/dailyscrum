"use server";

import {
  deleteDailySrcumUpdateAnswerByUpdateEntryId,
  updateDailyScrumUpdateAnswer,
} from "@/services/daily-scrum-update-answers";
import { deleteDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";

export async function editUpdate(formValues: { [answerId: number]: string }) {
  const promises = Object.entries(formValues).map(([answerId, value]) => {
    return updateDailyScrumUpdateAnswer(parseInt(answerId), { answer: value });
  });

  await Promise.all(promises);
}

export async function deleteUpdate(entryId: number) {
  await deleteDailySrcumUpdateAnswerByUpdateEntryId(entryId);
  await deleteDailyScrumUpdateEntry(entryId);
}

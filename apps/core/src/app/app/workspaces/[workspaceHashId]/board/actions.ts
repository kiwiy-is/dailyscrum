"use server";

import { deleteDailySrcumUpdateAnswerByUpdateEntryId } from "@/services/daily-scrum-update-answers";
import { deleteDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";

export async function deleteUpdate(entryId: number) {
  await deleteDailySrcumUpdateAnswerByUpdateEntryId(entryId);
  await deleteDailyScrumUpdateEntry(entryId);
}

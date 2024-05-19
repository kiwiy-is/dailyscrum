"use server";

import { updateDailyScrumUpdateAnswer } from "@/services/daily-scrum-update-answers";

export async function editUpdate(formValues: { [answerId: number]: string }) {
  const promises = Object.entries(formValues).map(([answerId, value]) => {
    return updateDailyScrumUpdateAnswer(parseInt(answerId), { answer: value });
  });

  await Promise.all(promises);
}

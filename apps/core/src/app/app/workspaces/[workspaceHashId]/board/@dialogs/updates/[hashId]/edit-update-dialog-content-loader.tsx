import { getDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import React from "react";

import { DateTime } from "luxon";
import { Database } from "@/lib/supabase/database";
import EditUpdateDialogContent from "./edit-update-dialog-content";
import { expressInJsDate } from "@/lib/date-time";

type Props = {
  updateEntryId: number | null;
};

const EditUpdateDialogContentLoader = async ({ updateEntryId }: Props) => {
  if (!updateEntryId) {
    return null;
  }

  const { data, error } = await getDailyScrumUpdateEntry(updateEntryId);

  if (error || !data) {
    return null;
  }

  if (!data.daily_scrum_update_form) {
    return null;
  }

  const description = data.daily_scrum_update_form.description;

  // TODO: Remove code duplication. AddScrumUpdateDialogLoader
  const questions = data.daily_scrum_update_answers
    .reduce<
      Database["daily_scrum"]["Tables"]["daily_scrum_update_questions"]["Row"][]
    >((acc, cv) => {
      return cv.daily_scrum_update_question === null
        ? acc
        : [...acc, cv.daily_scrum_update_question];
    }, [])
    .toSorted((a, b) => a.order - b.order)
    .map((question) => {
      return {
        id: question.id,
        label: question.question,
        isRequired: question.is_required,
        ...(question.placeholder ? { placeholder: question.placeholder } : {}),
        ...(question.description ? { description: question.description } : {}),
        ...(question.max_length ? { maxLength: question.max_length } : {}),
      };
    });

  const date = expressInJsDate(DateTime.fromISO(data.date));

  const answers = data.daily_scrum_update_answers.map((answer) => {
    return {
      id: answer.id,
      questionId: answer.daily_scrum_update_question_id,
      answer: answer.answer,
    };
  });

  // TODO: Disable editing for passed date. Disabled it when it's archived
  return (
    <EditUpdateDialogContent
      description={description}
      questions={questions}
      date={date}
      answers={answers}
    />
  );
};

export default EditUpdateDialogContentLoader;

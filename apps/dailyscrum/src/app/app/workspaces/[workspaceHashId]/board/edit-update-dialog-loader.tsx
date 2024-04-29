import { getDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import React from "react";

import { DateTime } from "luxon";
import { EditUpdateDialog } from "./edit-update-dialog";
import { getCurrentUser } from "@/services/users";
import { Database } from "@/lib/supabase/database";

type Props = {
  updateEntryId: number | null;
};

const EditUpdateDialogLoader = async ({ updateEntryId }: Props) => {
  if (!updateEntryId) {
    return null;
  }

  const { data, error } = await getDailyScrumUpdateEntry(updateEntryId);

  if (error || !data) {
    return null;
  }

  const { data: user, error: getCurrentUserError } = await getCurrentUser();

  if (getCurrentUserError || !user) {
    return null;
  }

  if (!data.daily_scrum_update_form) {
    return null;
  }

  const description = data.daily_scrum_update_form.description;

  // TODO: Remove code duplication. AddScrumUpdateDialogLoader
  const questions = data.daily_scrum_update_answers
    .reduce<
      Database["public"]["Tables"]["daily_scrum_update_questions"]["Row"][]
    >((acc, cv) => {
      console.log(cv.daily_scrum_update_question);
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

  const date = DateTime.fromISO(data.date).toJSDate();

  const answers = data.daily_scrum_update_answers.map((answer) => {
    return {
      id: answer.id,
      questionId: answer.daily_scrum_update_question_id,
      answer: answer.answer,
    };
  });

  // TODO: Disable editing for passed date. Disabled it when it's archived
  return (
    <EditUpdateDialog
      description={description}
      questions={questions}
      date={date}
      answers={answers}
    />
  );
};

export default EditUpdateDialogLoader;

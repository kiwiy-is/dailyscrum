import React from "react";
import { DateTime } from "luxon";
import { getCurrentUser } from "@/services/users";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getDailyScrumUpdateForm } from "@/services/daily-scrum-update-forms";
import { getDailyScrumUpdateEntriesCountOfCurrentUser } from "@/services/daily-scrum-update-entries";
import { getWorkspaceSettings } from "@/services/workspace-settings";
import AddUpdateDialogContent from "./add-update-dialog-content";

type Props = {
  workspaceHashId: string;
};

const AddUpdateDialogContentLoader = async ({ workspaceHashId }: Props) => {
  const { data: workspace, error: getWorkspaceError } =
    await getWorkspaceByHashId(workspaceHashId);

  if (getWorkspaceError || !workspace) {
    return null;
  }

  const { data: settings, error: getSettingsError } =
    await getWorkspaceSettings(workspace.id);

  if (getSettingsError || !settings) {
    return null;
  }

  const timeZone = settings.find(
    (setting) => setting.attribute_key === "time_zone"
  )?.attribute_value;

  const selectedDailyScrumUpdateFormIdValue = settings.find(
    (setting) => setting.attribute_key === "selected_daily_scrum_update_form_id"
  )?.attribute_value;

  if (!selectedDailyScrumUpdateFormIdValue || !timeZone) {
    return null;
  }

  const selectedDailyScrumUpdateFormId = parseInt(
    selectedDailyScrumUpdateFormIdValue,
    10
  );

  const today = DateTime.local({ zone: timeZone }).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const todayInISODate = today.toISODate();
  const tomorrowInISODate = tomorrow.toISODate();

  if (!todayInISODate || !tomorrowInISODate) {
    return null;
  }

  const [
    { data: dailyScrumUpdateForm, error: getDailyScrumUpdateFormError },
    todayResult,
    tomorrowResult,
  ] = await Promise.all([
    getDailyScrumUpdateForm(selectedDailyScrumUpdateFormId),
    getDailyScrumUpdateEntriesCountOfCurrentUser(
      selectedDailyScrumUpdateFormId,
      todayInISODate
    ),
    getDailyScrumUpdateEntriesCountOfCurrentUser(
      selectedDailyScrumUpdateFormId,
      tomorrowInISODate
    ),
  ]);

  const { count: todayEntriesCount, error: getTodayEntriesError } = todayResult;
  const { count: tomorrowEntriesCount, error: getTomorrowEntriesError } =
    tomorrowResult;

  if (
    getTodayEntriesError ||
    todayEntriesCount === null ||
    getTomorrowEntriesError ||
    tomorrowEntriesCount === null ||
    getDailyScrumUpdateFormError ||
    !dailyScrumUpdateForm
  ) {
    return null;
  }

  const { description, dailyScrumUpdateQuestions } = dailyScrumUpdateForm;

  // TODO: Remove code duplication. EditUpdateDialogLoader
  const questions = dailyScrumUpdateQuestions
    .toSorted((a, b) => a.order - b.order)
    .map((question) => {
      return {
        id: question.id.toString(),
        label: question.question,
        isRequired: question.is_required,
        ...(question.placeholder ? { placeholder: question.placeholder } : {}),
        ...(question.description ? { description: question.description } : {}),
        ...(question.max_length ? { maxLength: question.max_length } : {}),
      };
    });

  const hasAddedDailyScrumUpdateForToday = todayEntriesCount > 0;
  const hasAddedDailyScrumUpdateForTomorrow = tomorrowEntriesCount > 0;

  return (
    <AddUpdateDialogContent
      dailyScrumUpdateFormId={selectedDailyScrumUpdateFormId}
      description={description}
      questions={questions}
      timeZone={timeZone}
      hasAddedDailyScrumUpdateForToday={hasAddedDailyScrumUpdateForToday}
      hasAddedDailyScrumUpdateForTomorrow={hasAddedDailyScrumUpdateForTomorrow}
    />
  );
};

export default AddUpdateDialogContentLoader;

import React from "react";
import { AddScrumUpdateDialog } from "./add-scrum-update-dialog";
import {
  getCurrentUser,
  getOrgByHashId,
  getDailyScrumUpdateFormWithQuestions,
  getOrgSettings,
  getDailyScrumUpdateEntriesCount,
} from "@/lib/services";
import { getParams } from "next-impl-getters/get-params";
import { DateTime } from "luxon";

type Props = {};

const AddScrumUpdateDialogLoader = async (props: Props) => {
  const { orgId: orgHashId } = getParams() as { orgId: string };

  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError || !user) {
    return null;
  }

  const { data: org, error: getOrgError } = await getOrgByHashId(orgHashId);

  if (getOrgError || !org) {
    return null;
  }

  const { data: settings, error: getSettingsError } = await getOrgSettings(
    org.id
  );

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

  const today = DateTime.now().setZone(timeZone).startOf("day");
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
    getDailyScrumUpdateFormWithQuestions(selectedDailyScrumUpdateFormId),
    getDailyScrumUpdateEntriesCount(
      selectedDailyScrumUpdateFormId,
      todayInISODate
    ),
    getDailyScrumUpdateEntriesCount(
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
    <AddScrumUpdateDialog
      dailyScrumUpdateFormId={selectedDailyScrumUpdateFormId}
      description={description}
      questions={questions}
      timeZone={timeZone}
      hasAddedDailyScrumUpdateForToday={hasAddedDailyScrumUpdateForToday}
      hasAddedDailyScrumUpdateForTomorrow={hasAddedDailyScrumUpdateForTomorrow}
    />
  );
};

export default AddScrumUpdateDialogLoader;

import { DateTime } from "luxon";
import React from "react";
import DailyScrumUpdateList from "./daily-scrum-update-list";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { listDailyScrumUpdateEntries } from "@/services/daily-scrum-update-entries";
import { getWorkspaceSettings } from "@/services/workspace-settings";
import { getCurrentUser } from "@/services/users";

type Props = {
  workspaceHashId: string;
  dateQuery: string | undefined;
};

const DailyScrumUpdateListLoader = async ({
  workspaceHashId,
  dateQuery,
}: Props) => {
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

  const today = DateTime.local({ zone: timeZone }).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
      : today;

  const dateInISO = date.toISODate();

  if (!dateInISO) {
    return null;
  }

  const {
    data: dailyScrumUpdateEntries,
    error: getDailyScrumUpdateEntriesError,
  } = await listDailyScrumUpdateEntries(workspaceHashId, dateInISO);

  if (getDailyScrumUpdateEntriesError || !dailyScrumUpdateEntries) {
    return null;
  }

  const isDateArchived = !(
    date.hasSame(today, "day") || date.hasSame(tomorrow, "day")
  );

  const { data: currentUser, error: getCurrentUserError } =
    await getCurrentUser();

  const showAddUpdateCard =
    !isDateArchived &&
    !dailyScrumUpdateEntries.some((dailyScrumUpdateEntry) => {
      return dailyScrumUpdateEntry.user?.id === currentUser?.id;
    });

  const showNoUpdatesFoundForArchivedDates =
    isDateArchived && dailyScrumUpdateEntries.length === 0;

  const dailyScrumUpdates = dailyScrumUpdateEntries.map(
    ({
      user,
      daily_scrum_update_answers,
      daily_scrum_update_form_id,
      ...entry
    }) => {
      const today = DateTime.local({ zone: entry.time_zone }).startOf("day");
      const tomorrow = today.plus({ days: 1 });

      const date = DateTime.fromISO(entry.date).setZone(entry.time_zone, {
        keepLocalTime: true,
      });

      const isDateActive = !(date < today || date > tomorrow);

      const isEditable = user?.id === currentUser?.id && isDateActive;

      return {
        entryId: entry.id,
        isEditable,
        userName: user?.profile?.name ?? "",
        createdAt: entry.created_at,
        qaPairs: daily_scrum_update_answers
          .toSorted((a, b) => {
            return (
              (a.daily_scrum_update_question?.order ?? 0) -
              (b.daily_scrum_update_question?.order ?? 0)
            );
          })
          .map((answer) => {
            return {
              id: answer.id,
              question: {
                question: answer.daily_scrum_update_question?.question ?? "",
                briefQuestion:
                  answer.daily_scrum_update_question?.brief_question,
              },
              answer: {
                answer: answer.answer,
              },
            };
          }),
      };
    }
  );

  return (
    <DailyScrumUpdateList
      workspaceHashId={workspaceHashId}
      showAddUpdateCard={showAddUpdateCard}
      showNoUpdatesFoundForArchivedDates={showNoUpdatesFoundForArchivedDates}
      updates={dailyScrumUpdates}
    />
  );
};

export default DailyScrumUpdateListLoader;

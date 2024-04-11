import { DateTime } from "luxon";
import { getParams } from "next-impl-getters/get-params";
import { getSearchParams } from "next-impl-getters/get-search-params";

import React from "react";
import DailyScrumUpdateList from "./daily-scrum-update-list";
import { getOrgByHashId } from "@/services/orgs";
import { listDailyScrumUpdateEntries } from "@/services/daily-scrum-update-entries";
import { getOrgSettings } from "@/services/org-settings";

type Props = {};

const DailyScrumUpdateListLoader = async (props: Props) => {
  const { workspaceHashId } = getParams() as { workspaceHashId: string };
  const searchParams = getSearchParams();

  const { data: org, error: getOrgError } = await getOrgByHashId(
    workspaceHashId
  );

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

  const dateQuery = searchParams.get("date");

  const today = DateTime.local().setZone(timeZone).startOf("day");

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery)
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

  const dailyScrumUpdates = dailyScrumUpdateEntries.map(
    ({ daily_scrum_update_answers, daily_scrum_update_form_id, ...entry }) => {
      return {
        id: entry.id,
        userName: "John Doe", // TODO: pass in real user profile name
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

  return <DailyScrumUpdateList updates={dailyScrumUpdates} />;
};

export default DailyScrumUpdateListLoader;

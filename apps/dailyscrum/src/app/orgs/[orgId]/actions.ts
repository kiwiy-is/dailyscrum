"use server";

import {
  createDailyScrumUpdateAnswers,
  createDailyScrumUpdateEntry,
  createOrgWhereCurrentUserIsMember,
  initializeOrg,
} from "@/lib/services";
import { DateTime } from "luxon";

import { redirect } from "next/navigation";

export async function createNewOrganization(name: string) {
  let org;

  try {
    const { data, error: createOrgError } =
      await createOrgWhereCurrentUserIsMember({
        name,
      });

    if (createOrgError) {
      throw new Error(createOrgError.message);
    }

    org = data;

    const { error: initializeOrgError } = await initializeOrg(org.id);

    if (initializeOrgError) {
      throw new Error(initializeOrgError.message);
    }
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }

  redirect(`/orgs/${org.hash_id}`);
}

export async function addUpdate(
  formId: number,
  timeZone: string,
  formValues: {
    [x: number]: string;
  } & { date: Date }
) {
  try {
    const { date, ...dynamicFormValues } = formValues;

    const dateString = DateTime.fromJSDate(date).toISODate();

    if (!dateString) {
      throw new Error("Invalid date");
    }

    const { data: entry, error: insertDailyScrumUpdateEntryError } =
      await createDailyScrumUpdateEntry({
        daily_scrum_update_form_id: formId,
        date: dateString,
        time_zone: timeZone,
      });

    if (insertDailyScrumUpdateEntryError) {
      throw new Error(insertDailyScrumUpdateEntryError.message);
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
      throw new Error(createDailyScrumUpdateAnswersError.message);
    }
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
}

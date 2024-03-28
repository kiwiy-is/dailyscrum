import React from "react";
import DatePicker from "./date-picker";
import { getParams } from "next-impl-getters/get-params";
import { getOrgByHashId } from "@/services/orgs";
import { getOrgSettings } from "@/services/org-settings";

type Props = {};

const DatePickerLoader = async (props: Props) => {
  const { orgId: orgHashId } = getParams() as { orgId: string };

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

  if (!timeZone) {
    return null;
  }

  return <DatePicker timeZone={timeZone} />;
};

export default DatePickerLoader;

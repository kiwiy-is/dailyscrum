import React from "react";
import DatePicker from "./date-picker";
import { getParams } from "next-impl-getters/get-params";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getWorkspaceSettings } from "@/services/workspace-settings";

type Props = {};

const DatePickerLoader = async (props: Props) => {
  const { workspaceHashId } = getParams() as { workspaceHashId: string };

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

  if (!timeZone) {
    return null;
  }

  return <DatePicker timeZone={timeZone} />;
};

export default DatePickerLoader;

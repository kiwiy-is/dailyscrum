import React from "react";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getWorkspaceSettings } from "@/services/workspace-settings";
import PageSetter from "./page-setter";

type Props = {
  workspaceHashId: string;
};

const PageLoader = async ({ workspaceHashId }: Props) => {
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

  return <PageSetter timeZone={timeZone} />;
};

export default PageLoader;

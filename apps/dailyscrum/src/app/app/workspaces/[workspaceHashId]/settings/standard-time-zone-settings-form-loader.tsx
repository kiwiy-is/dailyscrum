import { getWorkspaceByHashId } from "@/services/workspaces";
import StandardTimeZoneSettingsForm from "./standard-time-zone-settings-form";
import { getWorkspaceSettings } from "@/services/workspace-settings";

type Props = {
  workspaceHashId: string;
};

const StandardTimeZoneSettingsFormLoader = async ({
  workspaceHashId,
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

  if (!timeZone) {
    return null;
  }

  return (
    <StandardTimeZoneSettingsForm
      workspaceId={workspace.id}
      timeZone={timeZone}
    />
  );
};

export default StandardTimeZoneSettingsFormLoader;

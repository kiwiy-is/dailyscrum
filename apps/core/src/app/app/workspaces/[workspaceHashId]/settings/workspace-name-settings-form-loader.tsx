import WorkspaceNameSettingsForm from "./workspace-name-settings-form";
import { getWorkspaceByHashId } from "@/services/workspaces";

type Props = {
  workspaceHashId: string;
};

const WorkspaceNameSettingsFormLoader = async ({ workspaceHashId }: Props) => {
  const { data: workspace, error: getWorkspaceError } =
    await getWorkspaceByHashId(workspaceHashId);

  if (getWorkspaceError || !workspace) {
    return null;
  }

  const { name } = workspace;

  return <WorkspaceNameSettingsForm workspaceId={workspace.id} name={name} />;
};

export default WorkspaceNameSettingsFormLoader;

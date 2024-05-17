import WorkspaceSelection from "./workspace-selection";
import { listWorkspacesOfCurrentUser } from "@/services/workspaces";

type Props = {
  children?: React.ReactNode;
  workspaceHashId: string;
};

const WorkspaceSelectionLoader: React.FC<Props> = async ({
  workspaceHashId,
}) => {
  const { data: workspaces, error } = await listWorkspacesOfCurrentUser();

  if (!workspaces || error || workspaces.length === 0) {
    return null;
  }

  const selectedWorkspace =
    workspaces.find((workspace) => workspace.id === workspaceHashId) ??
    workspaces[0];

  return (
    <WorkspaceSelection
      workspaces={workspaces}
      selectedWorkspace={selectedWorkspace}
    />
  );
};

export default WorkspaceSelectionLoader;

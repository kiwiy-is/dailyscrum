import {
  redirectIfNotSignedIn,
  redirectIfNotWorkspaceMember,
} from "@/lib/page-flows";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { notFound } from "next/navigation";

type Props = {
  workspaceHashId: string;
};

const PageFlowHandler = async ({ workspaceHashId }: Props) => {
  const user = await redirectIfNotSignedIn();

  const { data: workspace } = await getWorkspaceByHashId(workspaceHashId);

  if (!workspace) {
    return notFound();
  }

  await redirectIfNotWorkspaceMember(workspace.id, user.id);
  return null;
};

export default PageFlowHandler;

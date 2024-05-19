import React from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import {
  getWorkspaceByHashId,
  listWorkspacesOfCurrentUser,
} from "@/services/workspaces";

type Props = {
  returnPathQuery: string | undefined;
};

const CreateWorkspaceFormLoader = async ({ returnPathQuery }: Props) => {
  const returnPath = returnPathQuery
    ? decodeURIComponent(returnPathQuery)
    : undefined;

  const { data: workspaces } = await listWorkspacesOfCurrentUser();

  if (!workspaces) {
    return null;
  }

  const [workspace] = workspaces;

  let defaultValues: { name: string } | undefined;
  let worksapceId: number | undefined;

  if (workspace) {
    defaultValues = { name: workspace.name };
    const { data } = await getWorkspaceByHashId(workspace.id);
    worksapceId = data?.id;
  }

  return (
    <CreateWorkspaceForm
      workspaceId={worksapceId}
      returnPath={returnPath}
      defaultValues={defaultValues}
    />
  );
};

export default CreateWorkspaceFormLoader;

import React from "react";
import CreateWorkspaceForm from "./create-workspace-form";
import { listWorkspacesOfCurrentUser } from "@/services/workspaces";
import { redirect } from "next/navigation";

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

  if (workspaces.length > 0) {
    return redirect("/app");
  }

  return <CreateWorkspaceForm returnPath={returnPath} />;
};

export default CreateWorkspaceFormLoader;

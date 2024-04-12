"use server";

import { createMember } from "@/services/members";
import { getWorkspace } from "@/services/workspaces";
import { redirect } from "next/navigation";

export async function join(workspaceId: number, userId: string) {
  const response = await createMember({
    user_id: userId,
    workspace_id: workspaceId,
  });

  if (response.error) {
    return response;
  }

  const { data: workspace, error: getWorkspaceError } = await getWorkspace(
    workspaceId
  );

  if (getWorkspaceError) {
    return {
      error: getWorkspaceError,
    };
  }

  redirect(`/app/workspaces/${workspace.hash_id}`);
}

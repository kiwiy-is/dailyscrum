"use server";

import { createMember } from "@/services/members";
import { getWorkspace } from "@/services/workspaces";

export async function join(workspaceId: number, userId: string) {
  const response = await createMember({
    user_id: userId,
    workspace_id: workspaceId,
    role: "admin",
  });

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  const getWorkspaceResponse = await getWorkspace(workspaceId);

  return {
    data: getWorkspaceResponse.data,
    error: getWorkspaceResponse.error,
  };
}

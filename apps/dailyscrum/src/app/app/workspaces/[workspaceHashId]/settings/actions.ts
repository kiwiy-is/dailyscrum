"use server";

import { updateWorkspace } from "@/services/workspaces";

export async function updateWorkspaceName(workspaceId: number, name: string) {
  const response = await updateWorkspace(workspaceId, { name });

  if (response.error) {
    return {
      data: null,
      error: {
        message: response.error.message,
      },
    };
  }

  return response;
}

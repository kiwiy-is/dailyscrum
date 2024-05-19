"use server";

import {
  setUpWorkspaceForCurrentUser,
  updateWorkspace,
} from "@/services/workspaces";

export async function completeCreateWorkspace(
  workspaceId: number | undefined,
  name: string
) {
  if (workspaceId) {
    return updateWorkspace(workspaceId, {
      name,
    });
  } else {
    return setUpWorkspaceForCurrentUser({
      name,
    });
  }
}

"use server";

import { setUpWorkspaceForCurrentUser } from "@/services/workspaces";

export async function completeCreateWorkspace(name: string, timeZone: string) {
  return setUpWorkspaceForCurrentUser(
    {
      name,
    },
    timeZone
  );
}

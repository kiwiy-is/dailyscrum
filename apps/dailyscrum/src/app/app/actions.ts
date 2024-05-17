"use server";

import { setUpWorkspaceForCurrentUser } from "@/services/workspaces";

// create a initial workspace after sign up is complete
export async function initilizeWorkspace() {
  return setUpWorkspaceForCurrentUser({
    name: "My workspace",
  });
}

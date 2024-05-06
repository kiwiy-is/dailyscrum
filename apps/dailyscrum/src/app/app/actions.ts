"use server";

import { createWorkspace } from "@/services/workspaces";

// create a initial workspace after sign up is complete
export async function initilizeWorkspace() {
  return createWorkspace({
    name: "My workspace",
  });
}

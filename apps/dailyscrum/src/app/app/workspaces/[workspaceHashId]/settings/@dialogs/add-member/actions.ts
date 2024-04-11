"use server";

import {
  deleteInvitation,
  createInvitation as createInvitationService,
} from "@/services/invitations";

export async function createInvitation(workspaceId: number) {
  return await createInvitationService({ workspace_id: workspaceId });
}

export async function generateNewInvitationLink(workspaceId: number) {
  const response = await deleteInvitation(workspaceId);

  if (response.error) {
    return response;
  }

  return await createInvitation(workspaceId);
}

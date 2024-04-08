"use server";

import {
  deleteInvitation,
  createInvitation as createInvitationService,
} from "@/services/invitations";

export async function createInvitation(orgId: number) {
  return await createInvitationService({ org_id: orgId });
}

export async function generateNewInvitationLink(orgId: number) {
  const response = await deleteInvitation(orgId);

  if (response.error) {
    return response;
  }

  return await createInvitation(orgId);
}

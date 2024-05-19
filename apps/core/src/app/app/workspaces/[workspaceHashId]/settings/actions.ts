"use server";

import { deleteMember, updateMember } from "@/services/members";
import { updateWorkspaceTimeZone } from "@/services/workspace-settings";
import { updateWorkspace } from "@/services/workspaces";

export async function updateWorkspaceName(workspaceId: number, name: string) {
  return updateWorkspace(workspaceId, { name });
}

export async function updateStandardTimeZone(
  workspaceId: number,
  timeZone: string
) {
  return updateWorkspaceTimeZone(workspaceId, timeZone);
}

export async function updateRole(
  memberId: number,
  role: "owner" | "admin" | "member"
) {
  // TODO: Apply role change rules

  // RULES:
  // At least one member should be an owner
  // I can't change my own role
  // I can't change a member of higher role than my own
  // I can't change anyone's role if i'm not an owner or admin.

  const response = await updateMember(memberId, { role });

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  return {
    data: response.data.role,
  };
}

export async function removeMember(memberId: number) {
  // TODO: apply remove rules

  // RULES:
  // I can't remove myself
  // I can't remove a member of higher role than me
  // I can't remove anyone if i'm not an owner or admin.
  return deleteMember(memberId);
}

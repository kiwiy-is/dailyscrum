"use server";

import { createMember } from "@/services/members";
import { getOrg } from "@/services/orgs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function join(workspaceId: number, userId: string) {
  const response = await createMember({
    user_id: userId,
    org_id: workspaceId,
  });

  if (response.error) {
    return response;
  }

  const { data: org, error: getOrgError } = await getOrg(workspaceId);

  if (getOrgError) {
    return {
      error: getOrgError,
    };
  }

  revalidatePath(`/app/workspaces/${org.hash_id}`);
  redirect(`/app/workspaces/${org.hash_id}`);
}

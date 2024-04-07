"use server";

import { createMember } from "@/services/members";
import { getOrg } from "@/services/orgs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function join(orgId: number, userId: string) {
  const response = await createMember({
    user_id: userId,
    org_id: orgId,
  });

  if (response.error) {
    return response;
  }

  const { data: org, error: getOrgError } = await getOrg(orgId);

  if (getOrgError) {
    return {
      error: getOrgError,
    };
  }

  revalidatePath(`/daily-scrum/orgs/${org.hash_id}`);
  redirect(`/daily-scrum/orgs/${org.hash_id}`);
}

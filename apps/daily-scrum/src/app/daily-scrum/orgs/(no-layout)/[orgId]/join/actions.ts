"use server";

import { createClient } from "@/lib/supabase/client";
import { getOrg } from "@/services/orgs";
import { redirect } from "next/navigation";

export async function join(orgId: number, userId: string) {
  const client = createClient();

  const response = await client.from("members").insert({
    user_id: userId,
    org_id: orgId,
  });
  // TODO: revalidateTag(`listOrgs(${userId})`);

  if (response.error) {
    return response;
  }

  const { data: org, error: getOrgError } = await getOrg(orgId);

  if (getOrgError) {
    return {
      error: getOrgError,
    };
  }

  redirect(`/daily-scrum/orgs/${org.hash_id}`);
}

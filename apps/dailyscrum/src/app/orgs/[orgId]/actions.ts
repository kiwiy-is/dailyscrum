"use server";

import {
  createOrgWhereCurrentUserIsMember,
  initializeOrg,
} from "@/lib/services";

import { redirect } from "next/navigation";

export async function createNewOrganization(name: string) {
  let org;

  try {
    org = await createOrgWhereCurrentUserIsMember({
      name,
    });

    await initializeOrg(org.id);
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }

  redirect(`/orgs/${org.hash_id}`);
}

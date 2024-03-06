"use server";

import {
  createOrgWhereCurrentUserIsMember,
  initializeOrg,
} from "@/lib/services";

import { redirect } from "next/navigation";

export async function createNewOrganization(name: string) {
  let org;

  try {
    const { data, error: createOrgError } =
      await createOrgWhereCurrentUserIsMember({
        name,
      });

    if (createOrgError) {
      throw new Error(createOrgError.message);
    }

    org = data;

    const { error: initializeOrgError } = await initializeOrg(org.id);

    if (initializeOrgError) {
      throw new Error(initializeOrgError.message);
    }
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }

  redirect(`/orgs/${org.hash_id}`);
}

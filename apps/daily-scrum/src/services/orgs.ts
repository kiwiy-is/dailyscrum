import { cache } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { getCurrentUser } from "./users";
import { revalidateTag, unstable_cache } from "next/cache";
import { memoizeAndPersist } from "@/lib/cache";

const listOrgs = memoizeAndPersist(async (userId: string) => {
  const client = createClient<Database>();

  return await client
    .from("orgs")
    .select(
      `
        id: hash_id,
        name,
        members!inner(
          user_id
        )
      `
    )
    .eq("members.user_id", userId);
}, "listOrgs");

export const listOrgsOfCurrentUser = cache(async () => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      data: null,
      error: getCurrentUserError,
    };
  }

  if (!user) {
    return {
      data: null,
      error: { message: "User not found" },
    };
  }

  return listOrgs(user.id);
});

export const getOrgByHashId = memoizeAndPersist(async (hashId: string) => {
  const client = createClient<Database>();

  return client.from("orgs").select("*").eq("hash_id", hashId).single();
}, "getOrgByHashId");

/**
 * Creates a new organization with the provided organization values.
 * The new organiztiion is a member of the current user. Also, seeds the initial data for the organization.
 */
export const createOrg = async (
  orgValues: Required<
    Pick<Database["public"]["Tables"]["orgs"]["Insert"], "name">
  >
) => {
  const { data: user, error: getCurrentUserError } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      data: null,
      error: getCurrentUserError,
    };
  }

  if (!user) {
    return {
      data: null,
      error: { message: "User not found" },
    };
  }

  const client = createClient<Database>();

  const { data: orgs, error: insertOrgError } = await client
    .from("orgs")
    .insert(orgValues)
    .select();

  if (insertOrgError) {
    return { data: null, error: insertOrgError };
  }

  const [org] = orgs;

  if (!org) {
    return {
      data: null,
      error: {
        message: "Organization not found",
      },
    };
  }

  const { error: insertMemberError } = await client.from("members").insert({
    org_id: org.id,
    user_id: user.id,
  });

  if (insertMemberError) {
    return { data: null, error: insertMemberError };
  }
  const {
    data: orgDailyScrumUpdateForms,
    error: insertOrgDailyScrumUpdateFormError,
  } = await client
    .from("daily_scrum_update_forms")
    .insert({
      org_id: org.id,
      description:
        "Answer questions to keep your team updated and work through any challenges together.",
    })
    .select();

  if (insertOrgDailyScrumUpdateFormError) {
    return { data: null, error: insertOrgDailyScrumUpdateFormError };
  }

  const orgDailyScrumUpdateForm = orgDailyScrumUpdateForms[0];

  if (!orgDailyScrumUpdateForm) {
    return {
      data: null,
      error: { message: "Org Daily Scrum Update Form not found" },
    };
  }

  const { error: insertOrgSettingsError } = await client
    .from("org_settings")
    .insert([
      {
        org_id: org.id,
        attribute_key: "time_zone",
        attribute_value: "America/New_York", // TODO: Get user timezone
      },
      {
        org_id: org.id,
        attribute_key: "selected_daily_scrum_update_form_id",
        attribute_value: String(orgDailyScrumUpdateForm.id),
      },
    ]);

  if (insertOrgSettingsError) {
    return { data: null, error: insertOrgSettingsError };
  }

  // revalidateTag(`getOrgSettings(${org.id})`);

  const { error: insertOrgDailyScrumUpdateQuestionsError } = await client
    .from("daily_scrum_update_questions")
    .insert([
      {
        daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
        question: "What did I accomplish yesterday?",
        brief_question: "Yesterday's Progress",
        placeholder: "Your accomplishments from yesterday",
        description:
          "Describe a brief summary of completed tasks or milestones from yesterday.",
        is_required: true,
        max_length: 500,
        order: 0,
      },
      {
        daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
        question: "What will I work on today?",
        brief_question: "Today's Plan",
        placeholder: "Today's tasks and goals",
        description: "Describe your planned tasks or objectives for today.",
        is_required: true,
        max_length: 500,
        order: 1,
      },
      {
        daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
        question: "Do you have any blockers or impediments?",
        brief_question: "Obstacles",
        placeholder: "Current blockers or challenges",
        description:
          "Describe any current challenges or obstacles impacting your work.",
        is_required: true,
        max_length: 500,
        order: 2,
      },
    ]);

  if (insertOrgDailyScrumUpdateQuestionsError) {
    return { data: null, error: insertOrgDailyScrumUpdateQuestionsError };
  }

  revalidateTag(`listOrgs(${user.id})`);

  return {
    data: org,
    error: null,
  };
};

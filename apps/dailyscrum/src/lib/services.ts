// Naming convention: https://cloud.google.com/apis/design/standard_methods#list

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { revalidateTag, unstable_cache } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  // TODO: consider wrapping this with unstable_cache
  const authClient = createAuthClient(cookies());
  return await authClient.auth.getUser();
}

export async function listOrgsWhereCurrentUserIsMember() {
  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      error: getCurrentUserError,
    };
  }

  if (!user) {
    return {
      error: {
        message: "User not found",
      },
    };
  }

  const client = createClient<Database>();

  const { data, error } = await unstable_cache(
    async () => {
      return client
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
        .eq("members.user_id", user.id);
    },
    [`orgs-where-current-user-is-member`],
    {
      tags: [`orgs-where-current-user-is-member`],
      revalidate: false,
    }
  )();

  return { data, error };
}

export async function createOrgWhereCurrentUserIsMember(
  orgInsertData: Database["public"]["Tables"]["orgs"]["Insert"]
) {
  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    return { error: getCurrentUserError };
  }

  if (!user) {
    return { error: { message: "User not found" } };
  }

  const client = createClient<Database>();

  const { data: orgs, error: insertOrgError } = await client
    .from("orgs")
    .insert(orgInsertData)
    .select();

  if (insertOrgError) {
    return { error: insertOrgError };
  }

  const [org] = orgs;

  if (!org) {
    throw new Error("Organization not found");
  }

  const { error: insertMemberError } = await client.from("members").insert({
    org_id: org.id,
    user_id: user.id,
  });

  if (insertMemberError) {
    return { error: insertMemberError };
  }

  revalidateTag(`orgs-where-current-user-is-member`);

  return {
    data: org,
  };
}

export async function initializeOrg(orgId: number) {
  const client = createClient<Database>();

  const { error: insertOrgSettingsError } = await client
    .from("org_settings")
    .insert({
      org_id: orgId,
      attribute_key: "timeZone",
      attribute_value: "America/New_York",
    });

  if (insertOrgSettingsError) {
    return { error: insertOrgSettingsError };
  }

  const {
    data: orgDailyScrumUpdateForms,
    error: insertOrgDailyScrumUpdateFormError,
  } = await client
    .from("org_daily_scrum_update_forms")
    .insert({
      org_id: orgId,
      description:
        "Answer questions to keep your team updated and work through any challenges together.",
    })
    .select();

  if (insertOrgDailyScrumUpdateFormError) {
    return { error: insertOrgDailyScrumUpdateFormError };
  }

  const orgDailyScrumUpdateForm = orgDailyScrumUpdateForms[0];

  if (!orgDailyScrumUpdateForm) {
    return { error: { message: "Org Daily Scrum Update Form not found" } };
  }

  const { error: insertOrgDailyScrumUpdateQuestionsError } = await client
    .from("daily_scrum_update_questions")
    .insert([
      {
        org_daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
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
        org_daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
        question: "What will I work on today?",
        brief_question: "Today's Plan",
        placeholder: "Today's tasks and goals",
        description: "Describe your planned tasks or objectives for today.",
        is_required: true,
        max_length: 500,
        order: 1,
      },
      {
        org_daily_scrum_update_form_id: orgDailyScrumUpdateForm.id,
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
    return { error: insertOrgDailyScrumUpdateQuestionsError };
  }

  return {};
}

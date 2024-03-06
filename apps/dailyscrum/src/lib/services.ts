// Naming convention: https://cloud.google.com/apis/design/standard_methods#list

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { revalidateTag, unstable_cache } from "next/cache";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  // TODO: consider wrapping this with unstable_cache
  const authClient = createAuthClient(cookies());
  const {
    data: { user },
    error: getUserError,
  } = await authClient.auth.getUser();

  if (getUserError) {
    return {
      data: {
        user: null,
      },
      error: {
        message: getUserError.message,
      },
    };
  }

  return {
    data: {
      user,
    },
  };
}

export async function listOrgsWhereCurrentUserIsMember() {
  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    return {
      data: { user: null },
      error: getCurrentUserError,
    };
  }

  if (!user) {
    return {
      data: { user: null },
      error: {
        message: "User not found",
      },
    };
  }

  const client = createClient<Database>();

  return unstable_cache(
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
}

export function listAllOrgs() {
  const client = createClient<Database>();

  return unstable_cache(
    async () => {
      return client.from("orgs").select("*");
    },
    ["all-orgs"],
    {
      tags: ["all-orgs"],
      revalidate: false,
    }
  )();
}

export async function createOrgWhereCurrentUserIsMember(
  orgInsertData: Database["public"]["Tables"]["orgs"]["Insert"]
) {
  const {
    data: { user },
    error: getCurrentUserError,
  } = await getCurrentUser();

  if (getCurrentUserError) {
    throw new Error(getCurrentUserError.message);
  }

  if (!user) {
    throw new Error("User not found");
  }

  const client = createClient<Database>();

  const { data: orgs, error: insertOrgError } = await client
    .from("orgs")
    .insert(orgInsertData)
    .select();

  if (insertOrgError) {
    throw new Error(insertOrgError.message);
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
    throw new Error(insertMemberError.message);
  }

  revalidateTag(`orgs-where-current-user-is-member`);

  return org;
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
    throw new Error(insertOrgSettingsError.message);
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
    throw new Error(insertOrgDailyScrumUpdateFormError.message);
  }

  const orgDailyScrumUpdateForm = orgDailyScrumUpdateForms[0];

  if (!orgDailyScrumUpdateForm) {
    throw new Error("Org Daily Scrum Update Form not found");
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
    throw new Error(insertOrgDailyScrumUpdateQuestionsError.message);
  }
}

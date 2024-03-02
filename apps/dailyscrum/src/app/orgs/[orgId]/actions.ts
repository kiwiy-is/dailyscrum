"use server";

import { createAuthClient } from "@/lib/supabase/auth-client";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function initializeNewOrganization(
  orgInsertData: Database["public"]["Tables"]["orgs"]["Insert"],
  userId: string,
  userTimeZone: string
) {
  try {
    const client = createClient<Database>();

    const { data: orgs, error: insertOrganizationError } = await client
      .from("orgs")
      .insert(orgInsertData)
      .select();

    if (insertOrganizationError) {
      throw new Error(insertOrganizationError.message);
    }

    const org = orgs[0];

    if (!org) {
      throw new Error("Organization not found");
    }

    const insertMemberPromise = client.from("members").insert({
      org_id: org.id,
      user_id: userId,
    });

    const insertOrgSettingsPromise = client.from("org_settings").insert({
      org_id: org.id,
      attribute_key: "timeZone",
      attribute_value: userTimeZone,
    });

    const [{ error: insertMemberError }, { error: insertOrgSettingsError }] =
      await Promise.all([insertMemberPromise, insertOrgSettingsPromise]);

    if (insertMemberError) {
      throw new Error(insertMemberError.message);
    }

    if (insertOrgSettingsError) {
      throw new Error(insertOrgSettingsError.message);
    }

    const {
      data: orgDailyScrumUpdateForms,
      error: insertOrgDailyScrumUpdateFormError,
    } = await client
      .from("org_daily_scrum_update_forms")
      .insert({
        org_id: org.id,
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

    return org;
  } catch (error) {
    console.error(error);
    throw new Error("An unexpected error occurred. Please try again later.");
  }
}

export async function createNewOrganization(name: string) {
  const authClient = createAuthClient<Database>(cookies());

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const org = await initializeNewOrganization(
    {
      name,
    },
    user.id,
    "America/New_York" // TODO: take from a user
  );

  redirect(`/orgs/${org.hash_id}`);
}

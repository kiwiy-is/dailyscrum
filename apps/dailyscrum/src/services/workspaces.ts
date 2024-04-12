import { cache } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { getCurrentUser } from "./users";
import { memoize } from "@/lib/cache";

const listWorkspaces = memoize(async (userId: string) => {
  const client = createClient<Database>();

  // TODO: don't alias hash_id as id
  return await client
    .from("workspaces")
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
});

export const listWorkspacesOfCurrentUser = cache(async () => {
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

  return listWorkspaces(user.id);
});

export const getWorkspace = memoize(async (id: number) => {
  const client = createClient<Database>();

  return client.from("workspaces").select("*").eq("id", id).single();
});

export const getWorkspaceByHashId = memoize(async (hashId: string) => {
  const client = createClient<Database>();

  return client.from("workspaces").select("*").eq("hash_id", hashId).single();
});

/**
 * Creates a new workspace with the provided workspace values.
 * The new workspace is a member of the current user. Also, seeds the initial data for the workspace.
 */
export const createWorkspace = async (
  workspaceValues: Required<
    Pick<Database["public"]["Tables"]["workspaces"]["Insert"], "name">
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

  const { data: workspaces, error: insertWorkspaceError } = await client
    .from("workspaces")
    .insert(workspaceValues)
    .select();

  if (insertWorkspaceError) {
    return { data: null, error: insertWorkspaceError };
  }

  const [workspace] = workspaces;

  if (!workspace) {
    return {
      data: null,
      error: {
        message: "Workspace not found",
      },
    };
  }

  const { error: insertMemberError } = await client.from("members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
  });

  if (insertMemberError) {
    return { data: null, error: insertMemberError };
  }
  const {
    data: workspaceDailyScrumUpdateForms,
    error: insertWorkspaceDailyScrumUpdateFormError,
  } = await client
    .from("daily_scrum_update_forms")
    .insert({
      workspace_id: workspace.id,
      description:
        "Answer questions to keep your team updated and work through any challenges together.",
    })
    .select();

  if (insertWorkspaceDailyScrumUpdateFormError) {
    return { data: null, error: insertWorkspaceDailyScrumUpdateFormError };
  }

  const workspaceDailyScrumUpdateForm = workspaceDailyScrumUpdateForms[0];

  if (!workspaceDailyScrumUpdateForm) {
    return {
      data: null,
      error: { message: "Workspace Daily Scrum Update Form not found" },
    };
  }

  const { error: insertWorkspaceSettingsError } = await client
    .from("workspace_settings")
    .insert([
      {
        workspace_id: workspace.id,
        attribute_key: "time_zone",
        attribute_value: "America/New_York", // TODO: Get user timezone
      },
      {
        workspace_id: workspace.id,
        attribute_key: "selected_daily_scrum_update_form_id",
        attribute_value: String(workspaceDailyScrumUpdateForm.id),
      },
    ]);

  if (insertWorkspaceSettingsError) {
    return { data: null, error: insertWorkspaceSettingsError };
  }

  const { error: insertWorkspaceDailyScrumUpdateQuestionsError } = await client
    .from("daily_scrum_update_questions")
    .insert([
      {
        daily_scrum_update_form_id: workspaceDailyScrumUpdateForm.id,
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
        daily_scrum_update_form_id: workspaceDailyScrumUpdateForm.id,
        question: "What will I work on today?",
        brief_question: "Today's Plan",
        placeholder: "Today's tasks and goals",
        description: "Describe your planned tasks or objectives for today.",
        is_required: true,
        max_length: 500,
        order: 1,
      },
      {
        daily_scrum_update_form_id: workspaceDailyScrumUpdateForm.id,
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

  if (insertWorkspaceDailyScrumUpdateQuestionsError) {
    return { data: null, error: insertWorkspaceDailyScrumUpdateQuestionsError };
  }

  return {
    data: workspace,
    error: null,
  };
};

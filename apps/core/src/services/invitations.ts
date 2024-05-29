import { memoize } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getInvitationByCode = memoize(async (code: string) => {
  const client = createClient();
  return client.from("invitations").select().eq("code", code).single();
});

export const getInvitationByWorkspaceId = memoize(
  async (workspaceId: number) => {
    const client = createClient();
    return client
      .from("invitations")
      .select()
      .eq("workspace_id", workspaceId)
      .single();
  }
);

export const createInvitation = async (
  invitationValues: Database["daily_scrum"]["Tables"]["invitations"]["Insert"]
) => {
  const client = createClient();
  const response = await client
    .from("invitations")
    .insert(invitationValues)
    .select()
    .single();

  if (response.error) {
    return response;
  }

  return response;
};

export const deleteInvitation = async (workspaceId: number) => {
  const client = createClient();
  const response = await client
    .from("invitations")
    .delete()
    .eq("workspace_id", workspaceId);

  if (response.error) {
    return response;
  }

  return response;
};

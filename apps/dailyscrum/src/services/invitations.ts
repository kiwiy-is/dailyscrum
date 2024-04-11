import { memoizeAndPersist } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getInvitationByCode = memoizeAndPersist(async (code: string) => {
  const client = createClient();
  return client.from("invitations").select().eq("code", code).single();
}, "getInvitationByCode");

export const getInvitationByWorkspaceId = memoizeAndPersist(
  async (workspaceId: number) => {
    const client = createClient();
    return client
      .from("invitations")
      .select()
      .eq("workspace_id", workspaceId)
      .single();
  },
  "getInvitationByWorkspaceId"
);

export const createInvitation = async (
  invitationValues: Database["public"]["Tables"]["invitations"]["Insert"]
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

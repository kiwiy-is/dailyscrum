"use server";

import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export async function createInvitation(orgId: number) {
  const client = createClient<Database>();

  return await client
    .from("invitations")
    .insert({
      org_id: orgId,
    })
    .select()
    .single();
}

export async function generateNewInvitationLink(orgId: number) {
  const client = createClient<Database>();

  const deleteResponse = await client
    .from("invitations")
    .delete()
    .eq("org_id", orgId);

  return await createInvitation(orgId);
}

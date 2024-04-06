import React from "react";
import AddMemberDialog from "./add-member-dialog";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";
import { getParams } from "next-impl-getters/get-params";
import { createInvitation } from "./actions";
import { getOrgByHashId } from "@/services/orgs";
import { headers } from "next/headers";

type Props = {};

const AddMemberDialogLoader = async (props: Props) => {
  const { orgId: orgHashId } = getParams() as { orgId: string };
  const client = createClient<Database>();

  const { data: org, error: getOrgError } = await getOrgByHashId(orgHashId);

  if (getOrgError || !org) {
    return null;
  }

  const { data: invitation, error: getInvitationError } = await client
    .from("invitations")
    .select()
    .eq("org_id", org.id)
    .single();

  let code;
  if (!invitation) {
    const { data, error } = await createInvitation(org.id);
    if (!data) {
      return null;
    }
    code = data.code;
  } else {
    code = invitation.code;
  }

  return <AddMemberDialog verificationCode={code} orgId={org.id} />;
};

export default AddMemberDialogLoader;

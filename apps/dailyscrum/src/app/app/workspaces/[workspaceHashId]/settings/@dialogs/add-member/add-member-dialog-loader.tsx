import React from "react";
import AddMemberDialog from "./add-member-dialog";
import { getParams } from "next-impl-getters/get-params";
import { createInvitation } from "./actions";
import { getOrgByHashId } from "@/services/orgs";
import { getInvitationByOrgId } from "@/services/invitations";

type Props = {};

const AddMemberDialogLoader = async (props: Props) => {
  const { workspaceHashId } = getParams() as { workspaceHashId: string };

  const { data: org, error: getOrgError } = await getOrgByHashId(
    workspaceHashId
  );

  if (getOrgError || !org) {
    return null;
  }

  const { data: invitation, error: getInvitationError } =
    await getInvitationByOrgId(org.id);

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

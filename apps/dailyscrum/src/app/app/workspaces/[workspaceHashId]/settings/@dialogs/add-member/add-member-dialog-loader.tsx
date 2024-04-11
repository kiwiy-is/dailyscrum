import React from "react";
import AddMemberDialog from "./add-member-dialog";
import { getParams } from "next-impl-getters/get-params";
import { createInvitation } from "./actions";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getInvitationByWorkspaceId } from "@/services/invitations";

type Props = {};

const AddMemberDialogLoader = async (props: Props) => {
  const { workspaceHashId } = getParams() as { workspaceHashId: string };

  const { data: workspace, error: getWorkspaceError } =
    await getWorkspaceByHashId(workspaceHashId);

  if (getWorkspaceError || !workspace) {
    return null;
  }

  const { data: invitation, error: getInvitationError } =
    await getInvitationByWorkspaceId(workspace.id);

  let code;
  if (!invitation) {
    const { data, error } = await createInvitation(workspace.id);
    if (!data) {
      return null;
    }
    code = data.code;
  } else {
    code = invitation.code;
  }

  return <AddMemberDialog verificationCode={code} workspaceId={workspace.id} />;
};

export default AddMemberDialogLoader;

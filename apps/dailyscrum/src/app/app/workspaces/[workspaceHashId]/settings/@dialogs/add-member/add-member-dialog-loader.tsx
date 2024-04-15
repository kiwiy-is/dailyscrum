import React from "react";
import AddMemberDialog from "./add-member-dialog";
import { createInvitation } from "./actions";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getInvitationByWorkspaceId } from "@/services/invitations";

type Props = {
  workspaceHashId: string;
};

const AddMemberDialogLoader = async ({ workspaceHashId }: Props) => {
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

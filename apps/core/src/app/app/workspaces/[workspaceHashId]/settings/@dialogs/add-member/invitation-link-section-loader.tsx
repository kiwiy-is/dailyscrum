import React from "react";
import InvitationLinkSection from "./invitation-link-section";
import { createInvitation } from "./actions";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { getInvitationByWorkspaceId } from "@/services/invitations";

type Props = {
  workspaceHashId: string;
};

const InvitationLinkSectionLoader = async ({ workspaceHashId }: Props) => {
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

  return (
    <InvitationLinkSection verificationCode={code} workspaceId={workspace.id} />
  );
};

export default InvitationLinkSectionLoader;

import React from "react";
import MemberList from "./member-list";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { listMembers } from "@/services/members";

type Props = {
  workspaceHashId: string;
};

const MemberListLoader = async ({ workspaceHashId }: Props) => {
  const { data: workspace, error: getWorkspaceError } =
    await getWorkspaceByHashId(workspaceHashId);

  if (getWorkspaceError || !workspace) {
    return null;
  }

  const { data, error: getWorkspaceMembers } = await listMembers(workspace.id);

  if (getWorkspaceMembers || !data) {
    return null;
  }

  const members = data.map((member) => {
    return {
      id: member.id,
      email: member.user?.email ?? "",
      name: member.user?.profile?.name ?? "",
      role: member.role,
    };
  });

  return <MemberList members={members} />;
};

export default MemberListLoader;

import { getMember } from "@/services/members";
import { getCurrentUserProfile } from "@/services/profiles";
import { getCurrentUser } from "@/services/users";
import { listWorkspacesOfCurrentUser } from "@/services/workspaces";
import { notFound, redirect } from "next/navigation";

export const redirectIfNotSignedIn = async () => {
  const { data: user } = await getCurrentUser();

  if (!user) {
    return redirect("/app/sign-up");
  }

  return user;
};

export const redirectIfProfileDoesntExist = async () => {
  const { data: profile } = await getCurrentUserProfile();

  if (!profile) {
    return redirect("/app/onboard/create-profile");
  }
};

export const redirectIfNotWorkspaceMember = async (
  workspaceId: number,
  userId: string
) => {
  const { data: member } = await getMember(workspaceId, userId);

  if (!member) {
    return notFound();
  }
};

export const redirectIfProfileExists = async () => {
  const { data: profile } = await getCurrentUserProfile();

  if (profile) {
    return redirect("/app");
  }
};

export const redirectIfSignedIn = async () => {
  const { data: user } = await getCurrentUser();

  if (user) {
    return redirect("/app");
  }
};

export const redirectToWorkspaceBoard = async () => {
  const { data: workspaces, error } = await listWorkspacesOfCurrentUser();

  if (!workspaces) {
    console.error(error);
    return redirect("/app/error");
  }

  if (workspaces.length > 0) {
    const [workspace] = workspaces;
    return redirect(`/app/workspaces/${workspace.id}/board`);
  }

  return redirect(`/app/onboard/create-workspace`);
};

import { redirect } from "next/navigation";
import {
  createWorkspace,
  listWorkspacesOfCurrentUser,
} from "@/services/workspaces";
import { getCurrentUser } from "@/services/users";
import { getCurrentUserProfile } from "@/services/profiles";

export const dynamic = "force-dynamic";

export default async function Page() {
  // TODO: consider performing these on middleware
  const { data: user } = await getCurrentUser();

  if (!user) {
    redirect("/app/sign-up");
  }

  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (!profile || getProfileError) {
    redirect("/app/sign-up/complete");
  }

  const { data: workspaces, error } = await listWorkspacesOfCurrentUser();

  if (!workspaces || error) {
    return null;
  }

  if (workspaces.length > 0) {
    const [workspace] = workspaces;

    if (!workspace) {
      return null;
    }

    return redirect(`/app/workspaces/${workspace.id}`);
  }

  // TODO: Seems like the workspace is created multiple times. Maybe wrap it with a server action and call it here? Try and test it.
  const { data: workspace, error: createWorkspaceError } =
    await createWorkspace({
      name: "My workspace",
    });

  if (createWorkspaceError) {
    return null;
  }

  return redirect(`/app/workspaces/${workspace.hash_id}`);
}

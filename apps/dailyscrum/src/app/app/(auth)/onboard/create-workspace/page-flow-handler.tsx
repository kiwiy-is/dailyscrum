import { redirectIfNotSignedIn } from "@/lib/page-flows";
import { listWorkspacesOfCurrentUser } from "@/services/workspaces";
import { redirect } from "next/navigation";

type Props = {};

const PageFlowHandler = async (props: Props) => {
  await redirectIfNotSignedIn();

  const { data: workspaces, error } = await listWorkspacesOfCurrentUser();

  if (!workspaces) {
    console.error(error);
    return redirect("/app/error");
  }

  if (workspaces.length > 1) {
    return redirect("/app");
  }

  return null;
};

export default PageFlowHandler;

import { redirect } from "next/navigation";
import {
  getCurrentUser,
  listOrgsWhereCurrentUserIsMember,
} from "@/lib/services";
import { getCurrentUserProfile } from "./queries";

export default async function Home() {
  const {
    data: { user },
  } = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (getProfileError) {
    redirect("/sign-up/complete");
  }

  const { data: orgs, error } = await listOrgsWhereCurrentUserIsMember();

  if (!orgs || error || orgs.length === 0) {
    return null;
  }

  const [org] = orgs;

  if (!org) {
    return null;
  }

  return redirect(`/orgs/${org.id}`);
}

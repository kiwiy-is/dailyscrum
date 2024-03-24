import { redirect } from "next/navigation";
import {
  createOrgWhereCurrentUserIsMember,
  getCurrentUser,
  initializeOrg,
  listOrgsWhereCurrentUserIsMember,
} from "@/lib/services";
import { getCurrentUserProfile } from "../queries";

export default async function Home() {
  console.log("home start...");
  const {
    data: { user },
  } = await getCurrentUser();

  if (!user) {
    redirect("/daily-scrum/sign-in");
  }

  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (!profile || getProfileError) {
    redirect("/daily-scrum/sign-up/complete");
  }

  const { data: orgs, error } = await listOrgsWhereCurrentUserIsMember();

  if (!orgs || error) {
    return null;
  }

  if (orgs.length > 0) {
    const [org] = orgs;

    if (!org) {
      return null;
    }

    return redirect(`/daily-scrum/orgs/${org.id}`);
  }

  const { data: org, error: createOrgError } =
    await createOrgWhereCurrentUserIsMember({
      name: "My organization",
    });

  if (!org && createOrgError) {
    return null;
  }

  const { error: initializeOrgError } = await initializeOrg(org.id);

  if (initializeOrgError) {
    return null;
  }

  return redirect(`/daily-scrum/orgs/${org.id}`);
}

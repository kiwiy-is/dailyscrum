import { redirect } from "next/navigation";
import { createOrg, listOrgsOfCurrentUser } from "@/services/orgs";
import { getCurrentUser } from "@/services/users";
import { getCurrentUserProfile } from "@/services/profiles";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { data: user } = await getCurrentUser();

  if (!user) {
    redirect("/daily-scrum/sign-in");
  }

  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (!profile || getProfileError) {
    redirect("/daily-scrum/sign-up/complete");
  }

  const { data: orgs, error } = await listOrgsOfCurrentUser();

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

  // TODO: Seems like the organization is created multiple times. Maybe wrap it with a server action and call it here? Try and test it.
  const { data: org, error: createOrgError } = await createOrg({
    name: "My organization",
  });

  if (createOrgError) {
    return null;
  }

  return redirect(`/daily-scrum/orgs/${org.hash_id}`);
}

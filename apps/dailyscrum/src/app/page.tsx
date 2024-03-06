import { redirect } from "next/navigation";
import {
  getCurrentUser,
  listOrgsWhereCurrentUserIsMember,
} from "@/lib/services";

export default async function Home() {
  const {
    data: { user },
  } = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: orgs, error } = await listOrgsWhereCurrentUserIsMember();

  if (!orgs || error || orgs.length === 0) {
    return null;
  }

  const [org] = orgs;

  if (!org) {
    return null;
  }

  redirect(`/orgs/${org.id}`);
}

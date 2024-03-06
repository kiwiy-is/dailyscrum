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

  const { data: orgs } = await listOrgsWhereCurrentUserIsMember();

  if (!orgs || orgs.length === 0) {
    return null;
  }

  const [org] = orgs;

  if (!org) {
    return null;
  }

  redirect(`/orgs/${org.id}`);
}

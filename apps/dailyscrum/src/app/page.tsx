import { Database } from "@/lib/supabase/database";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default async function Home() {
  const authClient = createAuthClient<Database>(cookies());
  const client = createClient<Database>();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: orgs } = await client
    .from("orgs")
    .select(
      `
      id: hash_id,
      members!inner(
        user_id
      )
      `
    )
    .eq("members.user_id", user.id);

  if (!orgs || orgs.length === 0) {
    return null;
  }

  const org = orgs[0];
  redirect(`/orgs/${org.id}`);
}

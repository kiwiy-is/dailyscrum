import { Database } from "@/lib/supabase/database";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createClient<Database>(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: orgnizations } = await supabase
    .from("organizations")
    .select(
      `
      id,
      members (
        user_id
      )
      `
    )
    .filter("members.user_id", "eq", user.id);

  if (!orgnizations || orgnizations.length === 0) {
    return null;
  }

  const org = orgnizations[0];
  redirect(`/orgs/${org.id}`);
}

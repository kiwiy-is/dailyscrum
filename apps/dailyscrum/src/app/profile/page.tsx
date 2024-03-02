import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "ui/button";

const signOut = async () => {
  "use server";

  const authClient = createAuthClient(cookies());
  await authClient.auth.signOut();
  return redirect("/sign-in");
};

export default async function Page() {
  const authClient = createAuthClient(cookies());

  const {
    data: { user },
  } = await authClient.auth.getUser();

  return (
    <div>
      {user ? (
        <div>
          <form action={signOut}>
            <Button>Sign Out</Button>
          </form>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <Link href="/sign-in">sign in</Link>
      )}
    </div>
  );
}

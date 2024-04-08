import { getCurrentUser } from "@/services/users";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "ui/button";

export const dynamic = "force-dynamic";

const signOut = async () => {
  "use server";

  const authClient = createAuthClient(cookies());
  await authClient.auth.signOut();
};

export default async function Page() {
  const { data: user } = await getCurrentUser();

  return (
    <div>
      {user ? (
        <div>
          <form action={signOut}>
            <Button>Sign Out</Button>
          </form>

          <h2>User</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <Link href="/sign-in">sign in</Link>
      )}
    </div>
  );
}

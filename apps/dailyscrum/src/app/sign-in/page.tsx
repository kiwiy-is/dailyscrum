import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSearchParams } from "next-impl-getters/get-search-params";
import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import SignInForm from "./sign-in-form";

async function signIn(email: string) {
  "use server";

  const headerList = headers();

  const origin = headerList.get("origin");

  const cookieStore = cookies();
  const authClient = createAuthClient(cookieStore);
  const { error } = await authClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    return redirect(`/sign-in?error=${error.message}`);
  }

  return redirect("/sign-in/check-email");
}

export default function Page() {
  const searchParams = getSearchParams();
  const error = searchParams.get("error") ?? "";

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm onSignIn={signIn} error={error} />
        </CardContent>
      </Card>
    </div>
  );
}

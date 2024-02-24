import SignInCard from "./sign-in-card";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import { createClient } from "@/lib/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSearchParams } from "next-impl-getters/get-search-params";

export async function signIn(email: string) {
  "use server";

  const headerList = headers();

  const origin = headerList.get("origin");

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithOtp({
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
      <SignInCard onSignIn={signIn} error={error} />
    </div>
  );
}

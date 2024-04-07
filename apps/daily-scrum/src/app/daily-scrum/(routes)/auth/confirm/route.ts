import { createAuthClient } from "@/lib/supabase/auth-client";
import { createClient } from "@/lib/supabase/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * `GET /auth/confirm?code=${code}`
 * Handles a GET request by exchanging a code for a session and redirecting to the home page if successful.
 */
export async function GET(request: NextRequest) {
  const authClient = createAuthClient(cookies());
  const searchParams = request.nextUrl.searchParams;

  const codeParamValue = searchParams.get("code");
  const returnPathParamValue = searchParams.get("return-path");
  const returnPath = returnPathParamValue
    ? decodeURIComponent(returnPathParamValue)
    : undefined;

  if (!codeParamValue) {
    return new Response("Invalid request", { status: 400 });
  }

  const {
    data: { user },
    error,
  } = await authClient.auth.exchangeCodeForSession(codeParamValue);

  if (error) {
    console.error(error.message);
    return new Response("Invalid request", { status: 400 });
  }

  if (!user) {
    console.error("User not found");
    return new Response("Invalid request", { status: 400 });
  }

  const client = createClient();

  const { data: profile } = await client
    .from("profiles")
    .select()
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect(
      `/daily-scrum/sign-up/complete${
        returnPath ? `?return-path=${encodeURIComponent(returnPath)}` : ""
      }`
    );
  }

  if (!returnPath) {
    redirect("/daily-scrum");
  }

  redirect(returnPath);
}

import { createAuthClient } from "@/lib/supabase/auth-client";
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

  redirect("/");
}

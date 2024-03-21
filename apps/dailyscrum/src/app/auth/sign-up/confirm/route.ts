import { createAuthClient } from "@/lib/supabase/auth-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authClient = createAuthClient(cookies());
  const { searchParams } = new URL(request.url);

  const codeParamValue = searchParams.get("code");

  if (!codeParamValue) {
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  const {
    data: { user },
    error,
  } = await authClient.auth.exchangeCodeForSession(codeParamValue);

  if (error) {
    console.error(error.message);
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  if (!user) {
    console.error("User not found");
    return NextResponse.redirect(new URL("/sign-up", request.url));
  }

  return NextResponse.redirect(new URL("/sign-up/complete", request.url));
}

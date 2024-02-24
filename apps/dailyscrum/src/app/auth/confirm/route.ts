import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient(cookies());
  const { searchParams } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("error", error);
    }
  }

  return NextResponse.redirect(new URL("/profile", request.url));
}

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return new Response("Invalid request", { status: 400 });
}

// import { createAuthClient } from "@/lib/supabase/auth-client";
// import { createClient } from "@/lib/supabase/client";
// import { setUpWorkspaceForCurrentUser } from "@/services/workspaces";
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { NextRequest } from "next/server";

// /**
//  * `GET /auth/confirm?code=${code}`
//  * Handles a GET request by exchanging a code for a session and redirecting to the home page if successful.
//  */
// export async function GET(request: NextRequest) {
//   const authClient = createAuthClient(cookies());
//   const searchParams = request.nextUrl.searchParams;

//   const codeParamValue = searchParams.get("code");
//   const returnPathQuery = searchParams.get("return-path");
//   const returnPath = returnPathQuery
//     ? decodeURIComponent(returnPathQuery)
//     : undefined;

//   if (!codeParamValue) {
//     return new Response("Invalid request", { status: 400 });
//   }

//   const {
//     data: { user },
//     error,
//   } = await authClient.auth.exchangeCodeForSession(codeParamValue);

//   if (error) {
//     console.error(error.message);
//     return new Response("Invalid request", { status: 400 });
//   }

//   if (!user) {
//     console.error("User not found");
//     return new Response("Invalid request", { status: 400 });
//   }

//   const client = createClient();

//   const { data: profile } = await client
//     .schema("public")
//     .from("profiles")
//     .select()
//     .eq("id", user.id)
//     .single();

//   if (!profile) {
//     // NOTE: sign up flow
//     const [emailUserName] = user.email ? user.email?.split("@") : [user.id];

//     await Promise.all([
//       client.schema("public").from("profiles").insert({
//         id: user.id,
//         name: emailUserName,
//       }),
//       setUpWorkspaceForCurrentUser({
//         name: "My workspace",
//       }),
//     ]);

//     redirect(
//       `/app/onboard/create-profile${
//         returnPath ? `?return-path=${encodeURIComponent(returnPath)}` : ""
//       }`
//     );
//   }

//   if (!returnPath) {
//     redirect("/app");
//   }

//   redirect(returnPath);
// }

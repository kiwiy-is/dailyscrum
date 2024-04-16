import { memoize } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const listMembers = memoize(async (workspaceId: number) => {
  const client = createClient();
  return client
    .from("members")
    .select("*, user:users(email, profile:profiles(name))")
    .eq("workspace_id", workspaceId);
});

export const getMember = memoize(
  async (workspaceId: number, userId: string) => {
    const client = createClient();
    return client
      .from("members")
      .select()
      .match({
        workspace_id: workspaceId,
        user_id: userId,
      })
      .single();
  }
);

export const createMember = async (
  memberValues: Database["public"]["Tables"]["members"]["Insert"]
): Promise<{ data?: any; error?: any }> => {
  const client = createClient();

  const response = await client.from("members").insert(memberValues);

  if (response.error) {
    return response;
  }

  return response;
};

import { memoizeAndPersist } from "@/lib/cache";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export const getMember = memoizeAndPersist(
  async (orgId: number, userId: string) => {
    const client = createClient();
    return client
      .from("members")
      .select()
      .match({
        org_id: orgId,
        user_id: userId,
      })
      .single();
  },
  "getMember"
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

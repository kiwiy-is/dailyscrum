import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database";

export async function createMember(
  memberValues: Database["public"]["Tables"]["members"]["Insert"]
) {
  const client = createClient();

  const response = await client.from("members").insert(memberValues);

  if (response.error) {
    return response;
  }

  return response;
}

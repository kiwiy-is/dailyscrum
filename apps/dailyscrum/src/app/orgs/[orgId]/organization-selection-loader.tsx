import { getParams } from "next-impl-getters/get-params";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/database";
import { createAuthClient } from "@/lib/supabase/auth-client";
import OrganizationSelection from "./organization-selection";
import { createClient } from "@/lib/supabase/client";

type Props = {
  children?: React.ReactNode;
};

const OrganizationSelectionLoader: React.FC<Props> = async (props) => {
  const { orgId } = getParams() as { orgId: string };

  const authClient = createAuthClient<Database>(cookies());

  const client = createClient<Database>();

  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: orgs } = await client
    .from("orgs")
    .select(
      `
      id: hash_id,
      name,
      members!inner(
        user_id
      )
    `
    )
    .eq("members.user_id", user.id);

  if (!orgs) {
    return null;
  }

  const selectedOrg = orgs.find((org) => org.id === orgId) ?? orgs[0];

  return <OrganizationSelection orgs={orgs} selectedOrg={selectedOrg} />;
};

export default OrganizationSelectionLoader;

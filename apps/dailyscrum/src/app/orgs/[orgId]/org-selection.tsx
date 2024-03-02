import OrgSelectionUI from "@/components/org-selection";
import { redirect } from "next/navigation";
import { getParams } from "next-impl-getters/get-params";
import { cookies } from "next/headers";
import { Database } from "@/lib/supabase/database";
import { createClient } from "@/lib/supabase/server";

async function selectOrg(orgId: string) {
  "use server";
  redirect(`/orgs/${orgId}/dashboard`);
}

type Props = {
  children?: React.ReactNode;
};

const OrgSelection: React.FC<Props> = async (props) => {
  const { orgId } = getParams() as { orgId: string };

  const supabase = createClient<Database>(cookies());

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: organizations } = await supabase
    .from("organizations")
    .select(
      `
      id: hash_id,
      name,
      members (
        user_id
      )
    `
    )
    .filter("members.user_id", "eq", user.id);

  if (!organizations) {
    return null;
  }

  const selectedOrg =
    organizations.find((org) => org.id === orgId) ?? organizations[0];

  return (
    <OrgSelectionUI
      orgs={organizations}
      selectedOrg={selectedOrg}
      onOrgSelect={selectOrg}
    />
  );
};

export default OrgSelection;

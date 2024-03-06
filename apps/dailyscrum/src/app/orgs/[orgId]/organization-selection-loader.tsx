import { getParams } from "next-impl-getters/get-params";
import OrganizationSelection from "./organization-selection";
import { listOrgsWhereCurrentUserIsMember } from "@/lib/services";

type Props = {
  children?: React.ReactNode;
};

const OrganizationSelectionLoader: React.FC<Props> = async (props) => {
  const { orgId } = getParams() as { orgId: string };

  const { data: orgs } = await listOrgsWhereCurrentUserIsMember();

  if (!orgs) {
    return null;
  }

  const selectedOrg = orgs.find((org) => org.id === orgId) ?? orgs[0];

  return <OrganizationSelection orgs={orgs} selectedOrg={selectedOrg} />;
};

export default OrganizationSelectionLoader;

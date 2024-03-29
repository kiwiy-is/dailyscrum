import { getParams } from "next-impl-getters/get-params";
import OrganizationSelection from "./organization-selection";
import { listOrgsOfCurrentUser } from "@/services/orgs";

type Props = {
  children?: React.ReactNode;
};

const OrganizationSelectionLoader: React.FC<Props> = async (props) => {
  const { orgId } = getParams() as { orgId: string };

  const { data: orgs, error } = await listOrgsOfCurrentUser();

  if (!orgs || error || orgs.length === 0) {
    return null;
  }

  const selectedOrg = orgs.find((org) => org.id === orgId) ?? orgs[0];

  return <OrganizationSelection orgs={orgs} selectedOrg={selectedOrg} />;
};

export default OrganizationSelectionLoader;

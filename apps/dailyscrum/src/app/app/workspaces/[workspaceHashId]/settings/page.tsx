import WorkspaceNameSettingsCard from "./workspace-name-settings-card";
import MembersSettingsCard from "./members-settings-card";
import DeleteWorkspaceSettingsCard from "./delete-workspace-settings-card";
import StandardTimeZoneSettingsCard from "./standard-time-zone-settings-card";
import PageHeader from "@/components/page-header";
import { getMember } from "@/services/members";
import { getCurrentUser } from "@/services/users";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { NextPage } from "next";
import { redirect, notFound } from "next/navigation";
import {
  redirectIfNotSignedIn,
  redirectIfNotWorkspaceMember,
} from "@/lib/page-flows";

type Props = {
  params: { workspaceHashId: string };
};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    const user = await redirectIfNotSignedIn();

    const {
      params: { workspaceHashId },
    } = props;

    const { data: workspace } = await getWorkspaceByHashId(workspaceHashId);

    if (!workspace) {
      return notFound();
    }

    await redirectIfNotWorkspaceMember(workspace.id, user.id);

    return <Page {...props} />;
  };

  return Wrapper;
};

const Page = ({ params }: Props) => {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your workspace settings"
      />

      <div className="flex flex-col space-y-4">
        <WorkspaceNameSettingsCard workspaceHashId={params.workspaceHashId} />
      </div>

      <div className="flex flex-col space-y-4">
        <StandardTimeZoneSettingsCard
          workspaceHashId={params.workspaceHashId}
        />
      </div>

      <div className="flex flex-col space-y-4">
        <MembersSettingsCard workspaceHashId={params.workspaceHashId} />
      </div>

      <div className="flex flex-col space-y-4">
        <DeleteWorkspaceSettingsCard />
      </div>
    </div>
  );
};

export default pageFlowHandler(Page);

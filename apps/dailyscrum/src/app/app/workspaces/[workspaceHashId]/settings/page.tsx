import WorkspaceNameSettingsCard from "./workspace-name-settings-card";
import MembersSettingsCard from "./members-settings-card";
import DeleteWorkspaceSettingsCard from "./delete-workspace-settings-card";
import StandardTimeZoneSettingsCard from "./standard-time-zone-settings-card";
import PageHeader from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: { workspaceHashId: string };
}) {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your workspace settings."
      />

      <div className="flex flex-col space-y-4">
        <WorkspaceNameSettingsCard workspaceHashId={params.workspaceHashId} />
      </div>

      <div className="flex flex-col space-y-4">
        <StandardTimeZoneSettingsCard />
      </div>

      <div className="flex flex-col space-y-4">
        <MembersSettingsCard workspaceHashId={params.workspaceHashId} />
      </div>

      <div className="flex flex-col space-y-4">
        <DeleteWorkspaceSettingsCard />
      </div>
    </div>
  );
}

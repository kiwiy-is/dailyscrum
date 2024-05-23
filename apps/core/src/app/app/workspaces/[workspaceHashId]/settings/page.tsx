import WorkspaceNameSettingsCard from "./workspace-name-settings-card";
import MembersSettingsCard from "./members-settings-card";
import StandardTimeZoneSettingsCard from "./standard-time-zone-settings-card";
import PageHeader from "@/components/page-header";

import PageFlowHandler from "./page-flow-handler";
import { Suspense } from "react";
import VisibilityRefresher from "@/components/visibility-refresher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

type Props = {
  params: { workspaceHashId: string };
};

const Page = ({ params }: Props) => {
  return (
    <>
      <Suspense>
        <PageFlowHandler workspaceHashId={params.workspaceHashId} />
      </Suspense>
      <VisibilityRefresher />
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

        {/* TODO: Implement delete workspace */}
        {/* <div className="flex flex-col space-y-4">
          <DeleteWorkspaceSettingsCard />
        </div> */}
      </div>
    </>
  );
};

export default Page;

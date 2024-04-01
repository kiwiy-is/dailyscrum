import OrgNameSettingsCard from "./org-name-settings-card";
import MembersSettingsCard from "./members-settings-card";
import DeleteOrgSettingsCard from "./delete-org-settings-card";
import StandardTimeZoneSettingsCard from "./standard-time-zone-settings-card";
import PageHeader from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function Page({}: { params: { orgId: string } }) {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader
        title="Settings"
        description="Manage your organization settings."
      />

      <div className="flex flex-col space-y-4">
        <OrgNameSettingsCard />
      </div>

      <div className="flex flex-col space-y-4">
        <StandardTimeZoneSettingsCard />
      </div>

      <div className="flex flex-col space-y-4">
        <MembersSettingsCard />
      </div>

      <div className="flex flex-col space-y-4">
        <DeleteOrgSettingsCard />
      </div>
    </div>
  );
}

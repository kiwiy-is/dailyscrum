export const dynamic = "force-dynamic";

export default async function Page({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  return (
    <div>
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold leading-8 ">Settings</h1>
          {/* NOTE: A description text location */}
          <p className="text-sm text-muted-foreground">
            Manage your organization settings.
          </p>
        </div>
      </div>
    </div>
  );
}

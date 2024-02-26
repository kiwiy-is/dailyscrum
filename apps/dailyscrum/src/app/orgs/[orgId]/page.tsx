import { redirect } from "next/navigation";

export default async function Page({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  redirect(`/orgs/${orgId}/dashboard`);
}

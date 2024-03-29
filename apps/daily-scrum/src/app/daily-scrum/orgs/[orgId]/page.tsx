import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params: { orgId },
  searchParams,
}: {
  params: { orgId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  redirect(`/daily-scrum/orgs/${orgId}/board`);
}

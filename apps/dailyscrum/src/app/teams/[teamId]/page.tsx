import { redirect } from "next/navigation";

export default async function Page({
  params: { teamId },
}: {
  params: { teamId: string };
}) {
  redirect(`/teams/${teamId}/dashboard`);
}

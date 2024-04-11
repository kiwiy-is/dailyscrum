import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params: { workspaceHashId },
  searchParams,
}: {
  params: { workspaceHashId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  redirect(`/app/workspaces/${workspaceHashId}/board`);
}

import { getWorkspaceByHashId } from "@/services/workspaces";
import { getCurrentUser } from "@/services/users";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import { buttonVariants } from "ui/button";
import { cn } from "ui";
import JoinButton from "./join-button";
import { getInvitationByCode } from "@/services/invitations";
import { getMember } from "@/services/members";

type Props = {
  params: { workspaceHashId: string };
  searchParams: {
    code: string | undefined;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const { workspaceHashId } = params;
  const codeParamValue = searchParams.code;

  const { data: workspace } = await getWorkspaceByHashId(workspaceHashId);

  if (!workspace) {
    return null;
  }

  if (!codeParamValue) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>The invitation link is no longer valid</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The link might have expired. Please ask workspace members for an
            updated link.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const { data: invitation, error: getInvitationError } =
    await getInvitationByCode(codeParamValue);

  if (!invitation || getInvitationError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>The invitation link is no longer valid</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            The link might have expired. Please ask workspace members for an
            updated link.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const { data: user } = await getCurrentUser();

  if (!user) {
    const returnPath = `/app/workspaces/${workspace.hash_id}/join?code=${codeParamValue}`;

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Join {`"`}
            {workspace.name}
            {`"`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            You are invited to {`"`}
            {workspace.name}
            {`"`}. Please sign in to join the workspace.
          </CardDescription>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2 w-full">
            <Link
              className={cn(buttonVariants({ variant: "default" }), "flex-1")}
              href={`/app/sign-up?return-path=${encodeURIComponent(
                returnPath
              )}`}
            >
              Sign up
            </Link>

            <Link
              className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              href={`/app/sign-in?return-path=${encodeURIComponent(
                returnPath
              )}`}
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    );
  }

  const { data: member } = await getMember(workspace.id, user.id);

  if (member) {
    return (
      <div>
        <div>You are already a member of this Workspace.</div>
        <br />
        <Link href={`/app/workspaces/${workspaceHashId}`}>Go to Workspace</Link>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Join {`"`}
          {workspace.name}
          {`"`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          You are invited to {`"`}
          {workspace.name}
          {`"`}.
        </CardDescription>
      </CardContent>
      <CardFooter>
        <JoinButton workspaceId={workspace.id} userId={user.id} />
      </CardFooter>
    </Card>
  );
};

export default Page;

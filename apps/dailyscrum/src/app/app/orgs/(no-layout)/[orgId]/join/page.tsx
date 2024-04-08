import { getOrgByHashId } from "@/services/orgs";
import { getCurrentUser } from "@/services/users";
import Link from "next/link";
import React from "react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
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
  params: { orgId: string };
  searchParams: {
    code: string | undefined;
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const { orgId: orgHashId } = params;
  const codeParamValue = searchParams.code;

  const { data: org } = await getOrgByHashId(orgHashId);

  if (!org) {
    return null;
  }

  if (!codeParamValue) {
    return (
      <div className="h-screen flex flex-col justify-center items-center space-y-8">
        <KiwiyIsSymbol />
        <Card className="w-[440px]">
          <CardHeader>
            <CardTitle>The invitation link is no longer valid</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The link might have expired. Please ask organization members for
              an updated link.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: invitation, error: getInvitationError } =
    await getInvitationByCode(codeParamValue);

  if (!invitation || getInvitationError) {
    return (
      <div className="h-screen flex flex-col justify-center items-center space-y-8">
        <KiwiyIsSymbol />
        <Card className="w-[440px]">
          <CardHeader>
            <CardTitle>The invitation link is no longer valid</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              The link might have expired. Please ask organization members for
              an updated link.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: user } = await getCurrentUser();

  if (!user) {
    const returnPath = `/app/orgs/${org.hash_id}/join?code=${codeParamValue}`;

    return (
      <div className="h-screen flex flex-col justify-center items-center space-y-8">
        <KiwiyIsSymbol />
        <Card className="w-[440px]">
          <CardHeader>
            <CardTitle>Join "{org.name}"</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              You are invited to "{org.name}". Please sign in to join the
              organization.
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
      </div>
    );
  }

  const { data: member } = await getMember(org.id, user.id);

  if (member) {
    return (
      <div>
        <div>You are already a member of this Workspace.</div>
        <br />
        <Link href={`/app/orgs/${orgHashId}`}>Go to Workspace</Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle>Join "{org.name}"</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>You are invited to "{org.name}".</CardDescription>
        </CardContent>
        <CardFooter>
          <JoinButton orgId={org.id} userId={user.id} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;

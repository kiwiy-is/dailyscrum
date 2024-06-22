import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import CompleteSignUpForm from "./complete-sign-up-form";
import { getCurrentUserProfile } from "@/services/profiles";
import { Suspense } from "react";
import PageFlowHandler from "./page-flow-handler";
import { Metadata } from "next";
import { getCurrentUser } from "@/services/users";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create profile",
};

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const Page = async ({ searchParams }: Props) => {
  const returnPathQuery = searchParams["return-path"];
  const returnPath = returnPathQuery
    ? decodeURIComponent(returnPathQuery)
    : undefined;

  const { data: profile } = await getCurrentUserProfile();

  if (profile) {
    return redirect("/app");
  }

  const { data: user } = await getCurrentUser();

  let emailUserName = "";
  if (user) {
    const [userName] = user.email ? user.email?.split("@") : [user.id];
    emailUserName = userName;
  }

  return (
    <>
      <Suspense>
        <PageFlowHandler />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Create profile</CardTitle>
        </CardHeader>
        <CardContent>
          {/* TODO: Rename to create-profile-form */}
          {/* TODO: wrap in loader component */}
          <CompleteSignUpForm
            returnPath={returnPath}
            defaultValues={{
              name: emailUserName,
            }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;

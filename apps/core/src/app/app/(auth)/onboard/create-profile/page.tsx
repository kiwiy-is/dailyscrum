import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import CompleteSignUpForm from "./complete-sign-up-form";
import { getCurrentUserProfile } from "@/services/profiles";
import { Suspense } from "react";
import PageFlowHandler from "./page-flow-handler";

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const Page = async ({ searchParams }: Props) => {
  const returnPathQuery = searchParams["return-path"];
  const returnPath = returnPathQuery
    ? decodeURIComponent(returnPathQuery)
    : undefined;

  const { data: profile } = await getCurrentUserProfile();

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
            defaultValues={{ name: profile?.name ?? "" }}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;

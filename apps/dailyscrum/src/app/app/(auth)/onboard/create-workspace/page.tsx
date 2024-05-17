import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import PageFlowHandler from "./page-flow-handler";
import { Suspense } from "react";
import CreateWorkspaceFormLoader from "./create-workspace-form-loader";

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const Page = async ({ searchParams }: Props) => {
  return (
    <>
      <Suspense>
        <PageFlowHandler />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Create workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateWorkspaceFormLoader
            returnPathQuery={searchParams["return-path"]}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;

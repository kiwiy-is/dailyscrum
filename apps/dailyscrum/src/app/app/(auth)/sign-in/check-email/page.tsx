import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import PageFlowHandler from "../page-flow-handler";

type Props = {};

const Page = (props: Props) => {
  return (
    <>
      <Suspense>
        <PageFlowHandler />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            A sign in link will be sent to the email address you provided.
            Please check your email.
          </CardDescription>
        </CardContent>
      </Card>
    </>
  );
};

export default Page;

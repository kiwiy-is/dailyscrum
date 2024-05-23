import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import PageFlowHandler from "./page-flow-handler";
import VerificationForm from "./verification-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify",
};

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const Page = ({ searchParams }: Props) => {
  const returnPathQuery = searchParams["return-path"];
  const returnPath = returnPathQuery
    ? decodeURIComponent(returnPathQuery)
    : undefined;

  return (
    <>
      <Suspense>
        <PageFlowHandler />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Verify code</CardTitle>
          <CardDescription>
            We{`'`}ve sent a verification code to your email. Please enter it
            below to verify.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm returnPath={returnPath} />
        </CardContent>
      </Card>
    </>
  );
};

export default Page;

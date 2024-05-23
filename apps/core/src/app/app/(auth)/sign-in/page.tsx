import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import SignInForm from "./sign-in-form";
import Link from "next/link";
import { Suspense } from "react";
import PageFlowHandler from "./page-flow-handler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const Page = async ({ searchParams }: Props) => {
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
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm returnPath={returnPath} />
        </CardContent>
        <CardFooter className=" justify-center">
          <p className="text-sm text-muted-foreground">
            Don{`'`}t have an account?
            <Link
              href={`/app/sign-up${
                returnPathQuery ? `?return-path=${returnPathQuery}` : ""
              }`}
              className="underline underline-offset-4 hover:text-foreground ml-1"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default Page;

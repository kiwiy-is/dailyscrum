import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import SignUpForm from "./sign-up-form";
import Link from "next/link";
import { Suspense } from "react";
import PageFlowHandler from "./page-flow-handler";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
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
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm returnPath={returnPath} />
        </CardContent>
        <CardFooter className=" justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?
            <Link
              href={`/app/sign-in${
                returnPathQuery ? `?return-path=${returnPathQuery}` : ""
              }`}
              className="underline underline-offset-4 hover:text-foreground ml-1"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default Page;

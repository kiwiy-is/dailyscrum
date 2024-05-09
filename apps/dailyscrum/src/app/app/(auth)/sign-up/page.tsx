import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
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
import { NextPage } from "next";
import { redirectIfSignedIn } from "@/lib/page-flows";

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    await redirectIfSignedIn();

    return <Page {...props} />;
  };

  return Wrapper;
};

const Page = ({ searchParams }: Props) => {
  const returnPathParamValue = searchParams["return-path"];
  const returnPath = returnPathParamValue
    ? decodeURIComponent(returnPathParamValue)
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign up</CardTitle>
        <CardDescription>Create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm returnPath={returnPath} />
      </CardContent>
      <CardFooter className=" justify-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?
          <Link
            href={`/app/sign-in${
              returnPathParamValue ? `?return-path=${returnPathParamValue}` : ""
            }`}
            className="underline underline-offset-4 hover:text-foreground ml-1"
          >
            Sign in
          </Link>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default pageFlowHandler(Page);

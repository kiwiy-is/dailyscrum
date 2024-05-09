import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
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

const Page = async ({ searchParams }: Props) => {
  const returnPathParamValue = searchParams["return-path"];
  const returnPath = returnPathParamValue
    ? decodeURIComponent(returnPathParamValue)
    : undefined;

  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Sign in to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm returnPath={returnPath} />
        </CardContent>
        <CardFooter className=" justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
            <Link
              href={`/app/sign-up${
                returnPathParamValue
                  ? `?return-path=${returnPathParamValue}`
                  : ""
              }`}
              className="underline underline-offset-4 hover:text-foreground ml-1"
            >
              Sign up
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default pageFlowHandler(Page);

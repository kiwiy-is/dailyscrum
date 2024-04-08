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

export default function Page({
  searchParams,
}: {
  searchParams: { ["return-path"]: string | undefined };
}) {
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
}

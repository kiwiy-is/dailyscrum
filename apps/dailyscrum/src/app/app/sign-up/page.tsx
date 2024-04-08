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
                returnPathParamValue
                  ? `?return-path=${returnPathParamValue}`
                  : ""
              }`}
              className="underline underline-offset-4 hover:text-foreground ml-1"
            >
              Sign in
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

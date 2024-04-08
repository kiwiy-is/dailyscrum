import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import CompleteSignUpForm from "./complete-sign-up-form";

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
          <CardTitle>Complete sign up</CardTitle>
          <CardDescription>
            Please fill out the form to complete sign up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompleteSignUpForm returnPath={returnPath} />
        </CardContent>
      </Card>
    </div>
  );
}

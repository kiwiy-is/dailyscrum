import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import CompleteSignUpForm from "./complete-sign-up-form";
import { NextPage } from "next";
import {
  redirectIfProfileExists,
  redirectIfNotSignedIn,
} from "@/lib/page-flows";
import { getCurrentUserProfile } from "@/services/profiles";

type Props = {
  searchParams: { ["return-path"]: string | undefined };
};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    await redirectIfNotSignedIn();

    return <Page {...props} />;
  };

  return Wrapper;
};

const Page = async ({ searchParams }: Props) => {
  const returnPathParamValue = searchParams["return-path"];
  const returnPath = returnPathParamValue
    ? decodeURIComponent(returnPathParamValue)
    : undefined;

  const { data: profile } = await getCurrentUserProfile();

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
          <CompleteSignUpForm
            returnPath={returnPath}
            defaultValues={{ name: profile?.name ?? "" }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default pageFlowHandler(Page);

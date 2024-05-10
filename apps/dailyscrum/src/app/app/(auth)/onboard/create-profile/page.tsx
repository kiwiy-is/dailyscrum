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
import { redirectIfNotSignedIn } from "@/lib/page-flows";
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
    <Card>
      <CardHeader>
        <CardTitle>Create profile</CardTitle>
        <CardDescription>Complete your profile</CardDescription>
      </CardHeader>
      <CardContent>
        <CompleteSignUpForm
          returnPath={returnPath}
          defaultValues={{ name: profile?.name ?? "" }}
        />
      </CardContent>
    </Card>
  );
};

export default pageFlowHandler(Page);

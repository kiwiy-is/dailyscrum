import { redirectIfSignedIn } from "@/lib/page-flows";
import { NextPage } from "next";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";

type Props = {};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    await redirectIfSignedIn();

    return <Page {...props} />;
  };

  return Wrapper;
};

const Page = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          A sign up link will be sent to the email address you provided. Please
          check your email.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default pageFlowHandler(Page);

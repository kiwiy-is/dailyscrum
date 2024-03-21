import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign up link will be sent to the email address you provided.
            Please check your email.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

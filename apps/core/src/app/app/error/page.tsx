import React from "react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
type Props = {};

const Page = (props: Props) => {
  return (
    <div className="h-screen flex flex-col justify-center items-center space-y-8">
      <KiwiyIsSymbol />
      <Card className="w-[440px]">
        <CardHeader>
          <CardTitle>Apologies, but something went wrong</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            We’re not quite sure what went wrong. If it persists, please let us
            know at{" "}
            <a
              href="mailto:help@kiwiy.is"
              className="underline underline-offset-4 hover:text-foreground"
            >
              help@kiwiy.is
              {/* TODO: Actually make this help mail */}
            </a>
            .
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;

"use client";

import {
  Card as CardComponent,
  CardContent,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";

type Props = {};

const Card = (props: Props) => {
  return (
    <CardComponent className="w-[440px]">
      <CardHeader>
        <CardTitle>Check your email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {/* We'll send you a sign in link to this email address. */}
          {/* We sent you a sign in link to this email address. */}A sign in
          link will be sent to the email address you provided. Please check your
          email.
        </p>
      </CardContent>
    </CardComponent>
  );
};

export default Card;

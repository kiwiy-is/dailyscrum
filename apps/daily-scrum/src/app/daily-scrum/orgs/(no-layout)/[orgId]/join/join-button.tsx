"use client";

import { Button } from "ui/button";
import { join } from "./actions";
import { useTransition } from "react";

type Props = {
  orgId: number;
  userId: string;
};

const JoinButton = ({ orgId, userId }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="flex-1"
      onClick={() => {
        startTransition(() => {
          join(orgId, userId);
        });
      }}
      loading={isPending}
    >
      Join organization
    </Button>
  );
};

export default JoinButton;

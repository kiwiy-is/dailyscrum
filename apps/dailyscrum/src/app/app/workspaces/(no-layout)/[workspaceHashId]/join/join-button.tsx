"use client";

import { Button } from "ui/button";
import { join } from "./actions";
import { useTransition } from "react";

type Props = {
  workspaceId: number;
  userId: string;
};

const JoinButton = ({ workspaceId, userId }: Props) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="flex-1"
      onClick={() => {
        startTransition(() => {
          join(workspaceId, userId);
        });
      }}
      loading={isPending}
    >
      Join workspace
    </Button>
  );
};

export default JoinButton;

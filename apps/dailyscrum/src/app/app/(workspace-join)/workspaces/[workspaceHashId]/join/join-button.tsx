"use client";

import { Button } from "ui/button";
import { join } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: number;
  userId: string;
};

const JoinButton = ({ workspaceId, userId }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="flex-1"
      onClick={() => {
        startTransition(async () => {
          const { data: workspace } = await join(workspaceId, userId);
          if (!workspace) {
            return;
          }

          router.push(`/app/workspaces/${workspace.hash_id}/board`);
        });
      }}
      loading={isPending}
    >
      Join workspace
    </Button>
  );
};

export default JoinButton;

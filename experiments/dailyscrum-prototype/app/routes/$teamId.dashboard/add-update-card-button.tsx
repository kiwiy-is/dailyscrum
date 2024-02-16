import React from "react";
import { Button } from "~/lib/shadcn/ui";

import { PlusIcon } from "lucide-react";
import { useNavigate, useParams } from "@remix-run/react";

interface AddUpdateCardButtonButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function AddUpdateCardButtonUI(props: AddUpdateCardButtonButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-80 border-dashed"
      onClick={props.onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <PlusIcon size="16" />
        Add update
      </div>
    </Button>
  );
}

export default function AddUpdateCardButton() {
  const navigate = useNavigate();

  return (
    <AddUpdateCardButtonUI
      onClick={() => {
        navigate("?dialog=add-scrum-update", {
          preventScrollReset: true,
        });
      }}
    />
  );
}

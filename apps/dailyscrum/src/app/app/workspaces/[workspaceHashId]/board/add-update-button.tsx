"use client";

import { PlusIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "ui/button";

type Props = {};

const AddUpdateButton = (props: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("dialog", "add-scrum-update");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <Button
      variant="default"
      className="justify-start gap-x-2 text-sm"
      onClick={handleClick}
    >
      <PlusIcon width={16} height={16} strokeWidth={2} />
      <span>Add update</span>
    </Button>
  );
};

export default AddUpdateButton;

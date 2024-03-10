"use client";

import { PlusIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";
import { Button } from "ui/button";

type Props = {};

const AddUpdateButton = (props: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("dialog", "add-scrum-update");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, []);
  return (
    <Button className="justify-center  gap-x-2" size="sm" onClick={handleClick}>
      <PlusIcon width={16} height={16} strokeWidth={2} />
      <span className="mr-4">Add update</span>
    </Button>
  );
};

export default AddUpdateButton;

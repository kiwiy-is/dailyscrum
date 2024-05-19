"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "ui/button";

type Props = {};

const AddUpdateButton = (props: Props) => {
  const searchParams = useSearchParams();

  const pathname = usePathname();

  return (
    <Button variant="default" className="justify-start gap-x-2 text-sm" asChild>
      <Link href={`${pathname}/updates/new?${searchParams.toString()}`}>
        <PlusIcon width={16} height={16} strokeWidth={2} />
        <span>Add update</span>
      </Link>
    </Button>
  );
};

export default AddUpdateButton;

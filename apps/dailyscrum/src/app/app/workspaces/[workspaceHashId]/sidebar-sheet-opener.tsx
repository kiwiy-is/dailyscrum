"use client";

import { MenuIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "ui/button";
import { SheetContent, Sheet } from "ui/shadcn-ui/sheet";

type Props = {
  sheetContent: React.ReactNode;
};

const SidebarSheetOpener = ({ sheetContent }: Props) => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        onClick={() => setOpen(true)}
      >
        <MenuIcon size={20} />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className=" w-[80%] min-w-[224px] p-0">
          {sheetContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SidebarSheetOpener;

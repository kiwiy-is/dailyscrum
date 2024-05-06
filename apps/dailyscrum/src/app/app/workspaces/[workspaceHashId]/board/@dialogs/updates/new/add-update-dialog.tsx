"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "ui/dialog";

import { useRouter } from "next/navigation";

export interface AddUpdateDialogProps {
  content: React.ReactNode;
}

const AddUpdateDialog: React.FC<AddUpdateDialogProps> = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      setTimeout(() => {
        router.back();
      }, 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8">{content}</DialogContent>
    </Dialog>
  );
};

export default AddUpdateDialog;

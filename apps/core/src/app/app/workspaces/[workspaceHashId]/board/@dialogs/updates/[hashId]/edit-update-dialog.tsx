"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "ui/dialog";

import { useRouter, useSearchParams } from "next/navigation";

export interface EditScrumUpdateDialogProps {
  content: React.ReactNode;
}

// TODO: Open dialog as soon as edit button is clicked. Show loading state while defaultValues are fetching.
const EditUpdateDialog: React.FC<EditScrumUpdateDialogProps> = ({
  content,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => {
      router.back();
    }, 150);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8" id={searchParams.toString()}>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default EditUpdateDialog;

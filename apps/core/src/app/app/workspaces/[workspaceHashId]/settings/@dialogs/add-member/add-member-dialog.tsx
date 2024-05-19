"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui/dialog";

type Props = {
  invitationLinkSection?: React.ReactNode;
};

const AddMemberDialog = ({ invitationLinkSection }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const params = useParams<{ workspaceHashId: string }>();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => {
      router.push(`/app/workspaces/${params.workspaceHashId}/settings`, {
        scroll: false,
      });
    }, 150);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8">
        <DialogHeader>
          <DialogTitle>Add a member</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Invitation link
          </label>
          <div className="flex gap-x-2">{invitationLinkSection}</div>
          <p className="text-sm text-muted-foreground">
            Share this link to grant access. Invitees can join by opening the
            link. You can also generate a new link.
          </p>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;

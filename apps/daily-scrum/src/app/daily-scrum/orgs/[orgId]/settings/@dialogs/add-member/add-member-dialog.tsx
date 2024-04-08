"use client";

import { CheckCircleIcon, CopyIcon, MoreHorizontalIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";
import { Button, buttonVariants } from "ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "ui/shadcn-ui/alert-dialog";

import { Input } from "ui/shadcn-ui/input";
import { useToast } from "ui/shadcn-ui/use-toast";
import { generateNewInvitationLink } from "./actions";

type Props = {
  verificationCode: string;
  orgId: number;
};

const AddMemberDialog = ({ verificationCode, orgId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // TODO: change param value to [orgHashId]
  const params = useParams<{ orgId: string }>();

  const [invitationLink, setInvitationLink] = useState(
    `${window.location.origin}/daily-scrum/orgs/${params.orgId}/join?code=${verificationCode}`
  );

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = () => {
    setIsOpen(false);
    setTimeout(() => {
      router.push(`/daily-scrum/orgs/${params.orgId}/settings`, {
        scroll: false,
      });
    }, 150);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

  const { toast } = useToast();

  const invitationLinkInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
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
            <div className="flex gap-x-2">
              <Input
                ref={invitationLinkInputRef}
                placeholder=""
                readOnly
                value={invitationLink}
                disabled={isPending}
              />

              <Button
                variant="outline"
                size="icon"
                className="flex-shrink-0"
                onClick={() => {
                  invitationLinkInputRef.current?.select();
                  navigator.clipboard.writeText(
                    invitationLinkInputRef.current?.value || ""
                  );
                  toast({
                    description: (
                      <div className="flex items-center gap-x-2">
                        <CheckCircleIcon size={16} />
                        <span>Copied to clipboard.</span>
                      </div>
                    ),
                  });
                }}
              >
                <CopyIcon width={16} height={16} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <MoreHorizontalIcon width={16} height={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setIsConfirmDialogOpen(true);
                    }}
                  >
                    Generate new link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link to grant access. Invitees can join by opening the
              link. You can also generate a new link.
            </p>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate a new link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to generate a new link? Your old one will no
              longer be able to be used.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              loading={isPending}
              onClick={() =>
                startTransition(async () => {
                  const { data, error } = await generateNewInvitationLink(
                    orgId
                  );
                  if (error) {
                    return;
                  }

                  const { code } = data;
                  setInvitationLink(
                    `${window.location.origin}/orgs/${params.orgId}/join?code=${code}`
                  );

                  toast({
                    description: (
                      <div className="flex items-center gap-x-2">
                        <CheckCircleIcon size={16} />
                        <span>Successfully generated a new link.</span>
                      </div>
                    ),
                  });
                  setIsConfirmDialogOpen(false);
                })
              }
            >
              Generate
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AddMemberDialog;

"use client";

import { CheckCircleIcon, CopyIcon, MoreHorizontalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import { Button } from "ui/button";

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
  workspaceId: number;
};

const InvitationLinkSection = ({ verificationCode, workspaceId }: Props) => {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const params = useParams<{ workspaceHashId: string }>();

  const [invitationLink, setInvitationLink] = useState(
    `${window.location.origin}/app/workspaces/${params.workspaceHashId}/join?code=${verificationCode}`
  );

  const { toast } = useToast();

  const invitationLinkInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
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
          <Button variant="outline" size="icon" className="flex-shrink-0">
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
                    workspaceId
                  );
                  if (error) {
                    return;
                  }

                  const { code } = data;
                  setInvitationLink(
                    `${window.location.origin}/workspaces/${params.workspaceHashId}/join?code=${code}`
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

export default InvitationLinkSection;

"use client";

import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { cn } from "ui";
import { Button } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui/dropdown-menu";
import { Masonry } from "ui/masonry";
import { Card, CardContent } from "ui/shadcn-ui/card";
import { deleteUpdate } from "./actions";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "ui/shadcn-ui/alert-dialog";
import Link from "next/link";
import sqids from "@/lib/sqids";
import { DateTime } from "luxon";
import { markdown } from "@/lib/markdown";

const DailyScrumUpdateCard = ({
  entryId,
  isEditable,
  userName,
  createdAt,
  qaPairs,
}: {
  entryId: number;
  isEditable: boolean;
  userName: string;
  createdAt: string;
  qaPairs: {
    id: number;
    question: {
      question: string;
      briefQuestion?: string;
    };
    answer: {
      answer: string;
    };
  }[];
}) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const hasTransitionStarted = React.useRef(false);

  useEffect(() => {
    if (!isPending && hasTransitionStarted.current) {
      setIsConfirmDialogOpen(false);
      hasTransitionStarted.current = false;
    }
  }, [isPending]);

  return (
    <>
      <Card className="relative group" key={0}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                open ? "opacity-100" : "opacity-0",
                "transition	h-6 w-6 absolute right-5 top-5 group-hover:opacity-100 focus:opacity-100"
              )}
            >
              <MoreHorizontalIcon size="16" className="opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {isEditable && (
              <DropdownMenuItem
                onSelect={() => {
                  const hashId = sqids.encode([entryId]);
                  router.push(
                    `${pathname}/updates/${hashId}?${searchParams.toString()}`,
                    {
                      scroll: false,
                    }
                  );
                }}
              >
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>Copy text</DropdownMenuItem>
            {/* NOTE: Use only for testing purposes */}
            {/* <DropdownMenuItem
              onSelect={async () => {
                setIsConfirmDialogOpen(true);
              }}
            >
              Delete (Temporary)
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>

        <CardContent className="p-6">
          <div className="flex flex-col gap-y-6">
            <div className="flex flex-col space-y-1.5">
              <h3 className="text-base font-semibold">{userName}</h3>
              <p className="text-xs text-muted-foreground">
                {DateTime.fromISO(createdAt).toRelative()}
              </p>
            </div>
            {qaPairs.map(
              ({
                id,
                question,
                answer,
                // answerHtml
              }) => (
                <div className="flex flex-col space-y-1.5" key={id}>
                  <h4 className="text-sm font-medium">{question.question}</h4>

                  <div
                    className="text-sm [&>ul]:ml-6 [&>ul]:list-disc [&_a]:font-medium [&_a]:underline-offset-4 [&_a]:underline [&_p+*]:mt-2"
                    dangerouslySetInnerHTML={{
                      __html: markdown.render(answer.answer),
                    }}
                  />
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete daily scrum update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the update? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              loading={isPending}
              onClick={async () => {
                hasTransitionStarted.current = true;
                startTransition(async () => {
                  await deleteUpdate(entryId);

                  router.push(`${pathname}?${searchParams.toString()}`);
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

type Update = {
  entryId: number;
  isEditable: boolean;
  userName: string;
  createdAt: string;
  qaPairs: {
    id: number;
    question: {
      question: string;
      briefQuestion?: string;
    };
    answer: {
      answer: string;
    };
  }[];
};

type Props = {
  updates: Update[];
  showAddUpdateCard: boolean;
  showNoUpdatesFoundForArchivedDates: boolean;
};

const DailyScrumUpdateList = ({
  updates,
  showAddUpdateCard,
  showNoUpdatesFoundForArchivedDates,
}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (showNoUpdatesFoundForArchivedDates) {
    return (
      <div className="flex flex-col items-center  justify-center gap-y-2 h-[208px]">
        <div className="text-md font-semibold">No updates found</div>
        <div className="text-sm ">
          There were no updates added for the date.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Masonry
        className="max-w-[296px] min-[896px]:max-w-[608px] min-[1208px]:max-w-[920px] min-[1520px]:max-w-[1232px] min-[1832px]:max-w-[1544px] min-[2144px]:max-w-[1856px]" // 296px
        config={{
          gap: [16, 16, 16, 16, 16, 16],
          columns: [1, 2, 3, 4, 5, 6],
          media: [896, 1208, 1520, 1832, 2144, 99999],
        }}
        items={[
          ...updates,
          ...(showAddUpdateCard ? ["show-add-update-card"] : []),
        ]}
        render={(props) => {
          if (typeof props === "string") {
            return (
              <Button
                key={props}
                variant="outline"
                size="sm"
                className="justify-center gap-x-2 text-sm h-[208px] rounded-lg"
                asChild
              >
                <Link
                  href={`${pathname}/updates/new?${searchParams.toString()}`}
                >
                  <PlusIcon width={16} height={16} strokeWidth={2} />
                  <span className="font-medium ">Add update</span>
                </Link>
              </Button>
            );
          }

          const { entryId, isEditable, userName, qaPairs, createdAt } = props;
          return (
            <DailyScrumUpdateCard
              key={entryId}
              entryId={entryId}
              isEditable={isEditable}
              userName={userName}
              createdAt={createdAt}
              qaPairs={qaPairs}
            />
          );
        }}
      />
      {updates.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-y-4">
          <div className="text-center space-y-2">
            <div className="text-md font-semibold">
              Please share your update
            </div>
            <div className="text-sm ">
              Be the first to share yours and inspire others to follow!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// NOTE: A calculator for masonry grid properties. Use it to calculate.
// function calculateGridProperties(width = 240) {
//   const GAP = 16;
//   const SIDEBAR_WIDTH = 224;
//   const CONTENT_AREA_PADDING = 64;
//   const media = [];
//   let className = "";
//   for (let columnIndex = 0; columnIndex <= 6; columnIndex++) {
//     const columnWidth = (columnIndex + 1) * width + columnIndex * GAP;

//     if (columnIndex === 0) {
//       className += `max-w-[${columnWidth}px]`;
//       continue;
//     }

//     const minWidth = SIDEBAR_WIDTH + CONTENT_AREA_PADDING + columnWidth;
//     media.push(minWidth);
//     className += ` min-[${minWidth}px]:max-w-[${columnWidth}px]`;
//   }

//   return { media, className };
// }

export default DailyScrumUpdateList;

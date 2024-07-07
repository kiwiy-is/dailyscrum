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
import { createBrowserClient } from "@/lib/supabase/browser-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Skeleton } from "ui/shadcn-ui/skeleton";
import dynamic from "next/dynamic";

const Masonry = dynamic(() => import("./masonry"), {
  ssr: false,
});

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
        {isEditable && (
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
              {/* TODO: Implement copy text */}
              {/* <DropdownMenuItem>Copy text</DropdownMenuItem> */}
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
        )}

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

                  router.refresh();
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
  workspaceHashId: string;
  updates: Update[];
  showAddUpdateCard: boolean;
  showNoUpdatesFoundForArchivedDates: boolean;
};

const DailyScrumUpdateList = ({
  workspaceHashId,
  updates,
  showAddUpdateCard,
  showNoUpdatesFoundForArchivedDates,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const browserClient = createBrowserClient();
    let channel: RealtimeChannel | null = null;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        // Subscribe to the channel when the page becomes visible
        channel = browserClient.channel(`workspaces/${workspaceHashId}`);
        channel
          .on("broadcast", { event: "updateAdd" }, (payload) => {
            router.refresh();
            // TODO: update only the matching date page
            // const { date } = JSON.parse(payload.message) as { date: string };
          })
          .on("broadcast", { event: "updateEdit" }, (payload) => {
            router.refresh();
          })
          .subscribe((status) => {
            console.log(status);
          });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial subscription based on the initial visibility state
    handleVisibilityChange();

    return () => {
      // Unsubscribe from the channel and remove the event listener when the component is unmounted
      if (channel) {
        channel.unsubscribe();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router, workspaceHashId]);

  if (showNoUpdatesFoundForArchivedDates) {
    return (
      // TODO: Find alternative way..
      <div className="flex flex-1 flex-col items-center justify-center gap-y-2 min-h-[calc(100vh-284px)] md:!min-h-[calc(100vh-180px)]">
        <div className=" text-base font-semibold">No updates found</div>
        <div className="text-sm ">
          There were no updates added for the date.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Masonry
        items={[
          ...updates,
          ...(showAddUpdateCard
            ? [
                {
                  id: "show-add-update-card",
                },
              ]
            : []),
        ]}
        render={({ index, data, width }) => {
          if (data.id === "show-add-update-card") {
            return (
              <Button
                key={data}
                variant="outline"
                size="sm"
                className="justify-center gap-x-2 text-sm h-[208px] w-full rounded-lg"
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

          const { entryId, isEditable, userName, qaPairs, createdAt } = data;
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
      {/* TODO: This maybe not necessary. Consider removing it */}
      {/* {updates.length === 0 && (
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
      )} */}
    </div>
  );
};

export const DailyScrumUpdateListSkeleton = () => {
  const items = [
    { id: 0, heights: [40, 80, 40] },
    { id: 1, heights: [80, 120, 20] },
    { id: 2, heights: [80, 60, 40] },
    { id: 3, heights: [20, 80, 40] },
    { id: 4, heights: [40, 100, 20] },
    { id: 5, heights: [60, 40, 20] },
    { id: 6, heights: [20, 80, 40] },
    { id: 7, heights: [60, 120, 20] },
    { id: 8, heights: [20, 40, 40] },
    { id: 9, heights: [40, 120, 20] },
  ];
  return (
    <div>
      <Masonry
        items={items}
        render={({ data, width }) => {
          return (
            <div className="border rounded-lg shadow-sm relative">
              <div className="p-6">
                <div className="flex flex-col gap-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3>
                      <Skeleton className="w-[64px] max-w-full h-[24px]" />
                    </h3>
                    <div>
                      <Skeleton className="w-[112px] max-w-full h-[16px]" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[256px] max-w-full h-[20px]" />
                    </h4>
                    <div className="[&>ul]:ml-6">
                      <Skeleton
                        style={{ height: data.heights[0] }}
                        className="w-auto max-w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[208px] h-[20px] max-w-full" />
                    </h4>
                    <div className="[&>ul]:ml-6">
                      <Skeleton
                        style={{ height: data.heights[1] }}
                        className="w-auto max-w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[296px] h-[20px] max-w-full" />
                    </h4>
                    <div className="[&>ul]:ml-6">
                      <Skeleton
                        style={{ height: data.heights[2] }}
                        className="w-auto max-w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};
export default DailyScrumUpdateList;

import { PresentationIcon, Settings2Icon } from "lucide-react";
import { Button } from "ui/button";

import AddUpdateButton from "./add-update-button";
import DatePickerLoader from "./date-picker-loader";
import DailyScrumUpdateListLoader from "./daily-scrum-update-list-loader";
import PageHeader from "@/components/page-header";
import { Suspense } from "react";
import DailyScrumUpdateListSkeleton from "./daily-scrum-update-list-skeleton";
import DatePickerTriggerButton from "./date-picker-trigger-button";
import EditUpdateDialogLoader from "./edit-update-dialog-loader";

export default async function Page({
  params: { workspaceHashId },
  searchParams,
}: {
  params: { workspaceHashId: string };
  searchParams: { date?: string; dialog?: string; editUpdateItemId?: string };
}) {
  const datePickerSuspenseKey = new URLSearchParams({
    ...(searchParams.date && { date: searchParams.date }),
  }).toString();

  const listSuspenseKey = new URLSearchParams(searchParams).toString();

  const dateQuery = searchParams.date;

  const editUpdateItemId = searchParams.editUpdateItemId;

  return (
    <>
      <div className="flex flex-col space-y-8 max-w-screen-2xl">
        <PageHeader
          title="Board"
          actions={
            <>
              <AddUpdateButton />
              <Button
                variant="outline"
                className="justify-start gap-x-2 text-sm"
                disabled
              >
                <PresentationIcon width={16} height={16} strokeWidth={2} />
                Start meeting
              </Button>
            </>
          }
        />

        <div className="flex flex-col space-y-4">
          <div className="flex gap-x-2">
            <Suspense
              key={datePickerSuspenseKey}
              fallback={<DatePickerTriggerButton disabled />}
            >
              <DatePickerLoader workspaceHashId={workspaceHashId} />
            </Suspense>

            <Button variant="outline" className="gap-x-2 text-sm" disabled>
              <Settings2Icon width={16} height={16} strokeWidth={2} />
              <span>Settings</span>
            </Button>
          </div>
          <Suspense
            key={listSuspenseKey}
            fallback={<DailyScrumUpdateListSkeleton />}
          >
            <DailyScrumUpdateListLoader
              workspaceHashId={workspaceHashId}
              dateQuery={dateQuery}
            />
          </Suspense>
        </div>
      </div>

      <EditUpdateDialogLoader
        updateEntryId={editUpdateItemId ? Number(editUpdateItemId) : null}
      />
    </>
  );
}

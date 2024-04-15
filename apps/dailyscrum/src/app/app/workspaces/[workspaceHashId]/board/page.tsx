import { PresentationIcon, Settings2Icon } from "lucide-react";
import { Button } from "ui/button";

import AddUpdateButton from "./add-update-button";
import DatePickerLoader from "./date-picker-loader";
import DailyScrumUpdateListLoader from "./daily-scrum-update-list-loader";
import PageHeader from "@/components/page-header";
import { Suspense } from "react";
import DailyScrumUpdateListSkeleton from "./daily-scrum-update-list-skeleton";
import DatePickerTriggerButton from "./date-picker-trigger-button";

export default async function Page({
  params: { workspaceHashId },
  searchParams,
}: {
  params: { workspaceHashId: string };
  searchParams: { date?: string; dialog?: string };
}) {
  const datePickerSuspenseKey = new URLSearchParams({
    ...(searchParams.date && { date: searchParams.date }),
  }).toString();

  const listSuspenseKey = new URLSearchParams(searchParams).toString();

  const dateQuery = searchParams.date;

  return (
    <div className="flex flex-col space-y-8 max-w-screen-2xl">
      <PageHeader
        title="Board"
        actions={
          <>
            <AddUpdateButton />
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-x-2 text-sm h-9"
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

          <Button
            variant="outline"
            size="sm"
            className="gap-x-2 text-sm h-9"
            disabled
          >
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
  );
}

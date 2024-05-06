import { Settings2Icon } from "lucide-react";
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
  searchParams: { date?: string; dialog?: string; editUpdateItemId?: string };
}) {
  const datePickerSuspenseKey = new URLSearchParams({
    ...(searchParams.date && { date: searchParams.date }),
  }).toString();

  const mutableSearchParams = new URLSearchParams();
  mutableSearchParams.append("date", searchParams.date || "");
  const listSuspenseKey = mutableSearchParams.toString();

  const dateQuery = searchParams.date;

  return (
    <>
      <div className="flex flex-col space-y-8 max-w-screen-2xl">
        <PageHeader title="Board" />

        <div className="flex flex-col space-y-6">
          <div className="flex flex-wrap-reverse gap-y-2 gap-x-2 justify-between">
            <div className="flex gap-x-2">
              {/* TODO: implement */}
              <Button variant="outline" className="gap-x-2 text-sm">
                <span>Today</span>
              </Button>

              {/* TODO: implement */}
              <Button variant="outline" className="gap-x-2 text-sm">
                <span>Tomorrow</span>
              </Button>

              <Suspense
                key={datePickerSuspenseKey}
                fallback={<DatePickerTriggerButton disabled />}
              >
                <DatePickerLoader workspaceHashId={workspaceHashId} />
              </Suspense>
            </div>

            <div className="flex gap-x-2">
              <Button variant="outline" className="gap-x-2 text-sm" disabled>
                <Settings2Icon width={16} height={16} strokeWidth={2} />
                <span>Settings</span>
              </Button>

              <AddUpdateButton />
            </div>
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
    </>
  );
}

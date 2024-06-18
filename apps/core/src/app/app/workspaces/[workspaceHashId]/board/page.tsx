import PageHeader from "@/components/page-header";
import { Suspense } from "react";

import PageFlowHandler from "./page-flow-handler";
import { TodayButtonSkeleton } from "./today-button";

import AddUpdateButton from "./add-update-button";
import DailyScrumUpdateListLoader from "./daily-scrum-update-list-loader";
import { DailyScrumUpdateListSkeleton } from "./daily-scrum-update-list";
import PageLoader from "./page-loader";
import { PageDataProvider } from "./page-data-context";
import { DatePickerSkeleton } from "./date-picker";
import TodayButtonLoader from "./today-button-loader";
import DatePickerLoader from "./date-picker-loader";
import VisibilityRefresher from "@/components/visibility-refresher";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
};

type Props = {
  params: { workspaceHashId: string };
  searchParams: { date?: string; dialog?: string; editUpdateItemId?: string };
};

const Page = async ({ params: { workspaceHashId }, searchParams }: Props) => {
  const dateQuery = searchParams.date;

  const genralSuspenseKey = dateQuery || "";
  const pageFlowHandlerSuspenseKey = genralSuspenseKey + "page-flow-handler";
  const pageLoaderSuspenseKey = genralSuspenseKey + "page-loader";
  const updateListSuspenseKey = genralSuspenseKey + "update-list";

  return (
    <PageDataProvider>
      <Suspense key={pageFlowHandlerSuspenseKey}>
        <PageFlowHandler workspaceHashId={workspaceHashId} />
      </Suspense>
      <Suspense key={pageLoaderSuspenseKey}>
        <PageLoader workspaceHashId={workspaceHashId} />
      </Suspense>
      <VisibilityRefresher />
      <div className="flex flex-col max-w-screen-2xl">
        <PageHeader title="Board" />

        <div className="flex flex-wrap-reverse gap-y-2 gap-x-2 justify-between mt-8">
          <div className="flex gap-x-2">
            <Suspense fallback={<TodayButtonSkeleton />}>
              <TodayButtonLoader />
            </Suspense>

            <Suspense fallback={<DatePickerSkeleton />}>
              <DatePickerLoader />
            </Suspense>
          </div>

          <div className="flex gap-x-2">
            {/* TODO: implement board view settings */}
            {/* <Button variant="outline" className="gap-x-2 text-sm" disabled>
              <Settings2Icon width={16} height={16} strokeWidth={2} />
              <span>Settings</span>
            </Button> */}

            <AddUpdateButton />
          </div>
        </div>
        <div className="mt-6">
          <Suspense
            key={updateListSuspenseKey}
            fallback={<DailyScrumUpdateListSkeleton />}
          >
            <DailyScrumUpdateListLoader
              workspaceHashId={workspaceHashId}
              dateQuery={dateQuery}
            />
          </Suspense>
        </div>
      </div>
    </PageDataProvider>
  );
};

export default Page;

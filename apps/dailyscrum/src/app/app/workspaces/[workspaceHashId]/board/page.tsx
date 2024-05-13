import { Settings2Icon } from "lucide-react";
import { Button } from "ui/button";

import AddUpdateButton from "./add-update-button";
import DatePickerLoader from "./date-picker-loader";
import DailyScrumUpdateListLoader from "./daily-scrum-update-list-loader";
import PageHeader from "@/components/page-header";
import { Suspense } from "react";
import DailyScrumUpdateListSkeleton from "./daily-scrum-update-list-skeleton";
import DatePickerTriggerButton from "./date-picker-trigger-button";
import { getWorkspaceByHashId } from "@/services/workspaces";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import {
  redirectIfNotWorkspaceMember,
  redirectIfNotSignedIn,
} from "@/lib/page-flows";
import TodayButton from "./today-button";

type Props = {
  params: { workspaceHashId: string };
  searchParams: { date?: string; dialog?: string; editUpdateItemId?: string };
};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    const user = await redirectIfNotSignedIn();

    const {
      params: { workspaceHashId },
    } = props;

    const { data: workspace } = await getWorkspaceByHashId(workspaceHashId);

    if (!workspace) {
      return notFound();
    }

    await redirectIfNotWorkspaceMember(workspace.id, user.id);

    return <Page {...props} />;
  };

  return Wrapper;
};

const Page = ({ params: { workspaceHashId }, searchParams }: Props) => {
  const datePickerSuspenseKey = new URLSearchParams({
    ...(searchParams.date && { date: searchParams.date }),
  }).toString();

  const mutableSearchParams = new URLSearchParams();
  mutableSearchParams.append("date", searchParams.date || "");
  const listSuspenseKey = mutableSearchParams.toString();

  const dateQuery = searchParams.date;

  return (
    <>
      <div className="flex flex-col max-w-screen-2xl">
        <PageHeader title="Board" />

        <div className="flex flex-wrap-reverse gap-y-2 gap-x-2 justify-between mt-8">
          <div className="flex gap-x-2">
            <TodayButton
              workspaceHashId={workspaceHashId}
              dateQuery={dateQuery}
            />

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
        <div className="mt-6">
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
};

export default pageFlowHandler(Page);

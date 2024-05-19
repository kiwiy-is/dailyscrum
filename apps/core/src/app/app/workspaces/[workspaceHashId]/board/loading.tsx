import { Skeleton } from "ui/shadcn-ui/skeleton";
import { DailyScrumUpdateListSkeleton } from "./daily-scrum-update-list";
import { TodayButtonSkeleton } from "./today-button";
import { DatePickerSkeleton } from "./date-picker";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex flex-col space-y-8 max-w-screen-2xl">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <div className="flex items-center h-[36px]">
            <Skeleton className="w-[58px] max-w-full h-[32px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap-reverse gap-y-2 gap-x-2 justify-between mt-8">
        <div className="flex gap-x-2">
          <TodayButtonSkeleton />
          <DatePickerSkeleton />
        </div>
        <div className="flex gap-x-2">
          <Skeleton className="w-[134px] h-[40px] rounded-md" />
        </div>
      </div>

      <div className="mt-6">
        <DailyScrumUpdateListSkeleton />
      </div>
    </div>
  );
};

export default Loading;

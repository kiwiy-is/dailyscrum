import React from "react";
import { Skeleton } from "ui/shadcn-ui/skeleton";
import DailyScrumUpdateListSkeleton from "./daily-scrum-update-list-skeleton";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex flex-col space-y-8 max-w-screen-2xl">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <div className="flex items-center h-[32px]">
            <Skeleton className="w-[58px] max-w-full h-[28px]" />
          </div>
        </div>
        <div className="flex gap-x-2">
          <Skeleton className="w-[125px] h-[36px]" />
          <Skeleton className="w-[141px] h-[36px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <div className="flex gap-x-2">
          <Skeleton className="w-[135px] h-[36px]" />
          <Skeleton className="w-[105px] h-[36px]" />
        </div>
        <DailyScrumUpdateListSkeleton />
      </div>
    </div>
  );
};

export default Loading;

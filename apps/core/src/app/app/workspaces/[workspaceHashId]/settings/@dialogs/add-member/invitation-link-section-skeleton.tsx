import React from "react";
import { Skeleton } from "ui/shadcn-ui/skeleton";

type Props = {};

const InvitationLinkSectionSkeleton = (props: Props) => {
  return (
    <>
      <div className="flex items-center h-10 w-full border border-input px-3 py-2 file:border-0 rounded-md">
        <Skeleton className="w-full h-[16px]  max-w-full" />
      </div>
      <div className="inline-flex items-center justify-center border border-input h-10 w-10 flex-shrink-0 rounded-md">
        <Skeleton className="w-[16px] h-[16px]" />
      </div>
      <div className="inline-flex items-center justify-center border border-input h-10 w-10 flex-shrink-0 rounded-md">
        <Skeleton className="w-[16px] h-[16px]" />
      </div>
    </>
  );
};

export default InvitationLinkSectionSkeleton;

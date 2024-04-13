import React from "react";
import { Skeleton } from "ui/shadcn-ui/skeleton";

type Props = {};

const DailyScrumUpdateListSkeleton = (props: Props) => {
  return (
    <>
      <div className="min-[784px]:max-w-[496px] min-[1040px]:max-w-[752px] min-[1296px]:max-w-[1008px] min-[1552px]:max-w-[1264px] min-[1808px]:max-w-[1520px] grid items-start gap-4 grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div className="grid gap-y-4 grid-cols-1">
            <div className="border rounded-lg shadow-sm relative">
              <div className="p-6">
                <div className="flex flex-col gap-y-6">
                  <div className="flex flex-col space-y-1.5">
                    <h3>
                      <Skeleton className="w-[64px] max-w-full h-[24px]" />
                    </h3>
                    <p>
                      <Skeleton className="w-[112px] max-w-full h-[16px]" />
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[256px] max-w-full h-[20px]" />
                    </h4>
                    <div className="[&amp;>ul]:ml-6">
                      <Skeleton className="w-auto max-w-full h-[40px]" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[208px] h-[20px] max-w-full" />
                    </h4>
                    <div className="[&amp;>ul]:ml-6">
                      <Skeleton className="w-auto h-[120px] max-w-full" />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <h4>
                      <Skeleton className="w-[320px] h-[20px] max-w-full" />
                    </h4>
                    <div className="[&amp;>ul]:ml-6">
                      <Skeleton className="w-auto h-[10px] max-w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DailyScrumUpdateListSkeleton;

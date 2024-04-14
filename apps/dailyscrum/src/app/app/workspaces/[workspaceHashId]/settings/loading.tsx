import React from "react";
import { Skeleton } from "ui/shadcn-ui/skeleton";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div>
      <div className="space-y-8 max-w-4xl">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <div className="flex items-center h-[32px]">
              <Skeleton className="w-[64px] max-w-full h-[28px]" />
            </div>
            <p>
              <Skeleton className="w-[248px] max-w-full h-[20px]" />
            </p>
          </div>
        </div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex flex-col space-y-4">
            <div className="border shadow-sm rounded-lg">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="tracking-tight">
                  <Skeleton className="w-[112px] max-w-full h-[24px]" />
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="leading-none h-[24px] flex items-center">
                      <Skeleton className="w-[54px] max-w-full h-[17px]" />
                    </div>
                    <div className="flex h-10 w-full border border-input px-3 py-2 file:border-0 rounded-md">
                      <Skeleton className="w-[128px] max-w-full" />
                    </div>
                  </div>
                  <div className="items-center justify-center transition-colors h-9">
                    <Skeleton className="w-[56px] max-w-full h-[36px]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

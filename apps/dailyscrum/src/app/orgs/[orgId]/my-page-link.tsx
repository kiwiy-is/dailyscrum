"use client";

import React from "react";
import { cn } from "ui";
import { Button } from "ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "ui/shadcn-ui/tooltip";

type Props = {};

const MyPageLink = (props: Props) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={350}>
        <TooltipTrigger asChild>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className={cn("justify-start")}
              disabled
            >
              My updates
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>The page is not available yet. Please check back later.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MyPageLink;

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
      <Tooltip>
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
        <TooltipContent side="right">
          <p>The page is under development. Please check back later.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MyPageLink;

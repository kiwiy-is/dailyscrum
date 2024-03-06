"use client";

import { ScrollTextIcon } from "lucide-react";
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
              className={cn("justify-start", "gap-x-2")}
              disabled
            >
              <ScrollTextIcon width={16} height={16} strokeWidth={1.75} />
              <span>My updates</span>
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

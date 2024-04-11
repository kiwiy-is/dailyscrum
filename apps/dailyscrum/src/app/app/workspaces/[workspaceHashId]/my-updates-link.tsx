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

const MyUpdatesLink = (props: Props) => {
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
              <ScrollTextIcon width={16} height={16} strokeWidth={2} />
              <span>My updates</span>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="start">
          <p>
            The page is under development. <br />
            Please check back later.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MyUpdatesLink;

"use client";

import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { Button, ButtonProps } from "ui/button";
import { useDateFromSearchParams } from "./use-date-from-search-params";

type Props = {
  timeZone?: string;
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

const DatePickerTriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ timeZone, ...props }, ref) => {
    const date = useDateFromSearchParams(timeZone);

    return (
      <Button
        ref={ref}
        variant="outline"
        size="sm"
        className="gap-x-2 text-sm h-9"
        {...props}
      >
        <CalendarIcon width={16} height={16} strokeWidth={2} />

        <span>{date.toLocaleString(DateTime.DATE_MED)}</span>
      </Button>
    );
  }
);

DatePickerTriggerButton.displayName = "DatePickerTriggerButton";

export default DatePickerTriggerButton;

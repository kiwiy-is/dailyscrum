"use client";

import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { Button, ButtonProps } from "ui/button";
import { useSearchParams } from "next/navigation";

type Props = {
  timeZone?: string;
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

const DatePickerTriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ timeZone, ...props }, ref) => {
    const searchParams = useSearchParams();
    const dateQuery = searchParams.get("date");
    const today = timeZone
      ? DateTime.local().setZone(timeZone).startOf("day")
      : null;
    const date =
      dateQuery && DateTime.fromISO(dateQuery).isValid
        ? DateTime.fromISO(dateQuery)
        : today;

    return (
      <Button
        ref={ref}
        variant="outline"
        size="sm"
        className="gap-x-2 text-sm h-9"
        {...props}
      >
        <CalendarIcon width={16} height={16} strokeWidth={2} />

        {date ? (
          <span>{date.toLocaleString(DateTime.DATE_MED)}</span>
        ) : (
          <div className="w-[86px]" />
        )}
      </Button>
    );
  }
);

DatePickerTriggerButton.displayName = "DatePickerTriggerButton";

export default DatePickerTriggerButton;

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
      ? DateTime.local({ zone: timeZone }).startOf("day")
      : null;
    const date =
      dateQuery && DateTime.fromISO(dateQuery).isValid
        ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
        : today;

    return (
      <Button
        ref={ref}
        variant="outline"
        className="gap-x-2 text-sm"
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

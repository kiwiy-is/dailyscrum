"use client";

import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";
import React from "react";
import { Button, ButtonProps } from "ui/button";
import { useSearchParams } from "next/navigation";
import { formatDateAddYearIfDifferent, getGmtOffset } from "@/lib/date-time";

type Props = {
  timeZone?: string;
} & ButtonProps;

const DatePickerTriggerButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ timeZone, ...props }, ref) => {
    const searchParams = useSearchParams();
    const dateQuery = searchParams.get("date");

    const today = React.useMemo(
      () =>
        timeZone ? DateTime.local({ zone: timeZone }).startOf("day") : null,
      [timeZone]
    );

    const date = React.useMemo(() => {
      if (dateQuery && DateTime.fromISO(dateQuery).isValid) {
        return DateTime.fromISO(dateQuery).setZone(timeZone, {
          keepLocalTime: true,
        });
      }
      return today;
    }, [dateQuery, timeZone, today]);

    const formattedDate = React.useMemo(
      () => (date && today ? formatDateAddYearIfDifferent(date, today) : null),
      [date, today]
    );

    const gmtOffset = React.useMemo(
      () => (timeZone ? getGmtOffset(timeZone) : null),
      [timeZone]
    );

    return (
      <Button
        ref={ref}
        variant="outline"
        className="gap-x-2 text-sm"
        {...props}
      >
        <CalendarIcon width={16} height={16} strokeWidth={2} />

        {formattedDate ? (
          <>
            <div>{formattedDate}</div>
            {gmtOffset && (
              <div className="text-muted-foreground">({gmtOffset})</div>
            )}
          </>
        ) : (
          <div className="w-[86px]" />
        )}
      </Button>
    );
  }
);

DatePickerTriggerButton.displayName = "DatePickerTriggerButton";

export default DatePickerTriggerButton;

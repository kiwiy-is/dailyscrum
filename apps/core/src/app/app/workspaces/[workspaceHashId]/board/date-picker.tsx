"use client";

import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { cn } from "ui";
import { Button, buttonVariants } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "ui/dropdown-menu";
import { Calendar } from "ui/shadcn-ui/calendar";
import DatePickerTriggerButton from "./date-picker-trigger-button";
import { Skeleton } from "ui/shadcn-ui/skeleton";
import { expressInJsDate } from "@/lib/date-time";

type Props = {
  timeZone: string;
};

const DatePicker = ({ timeZone }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const today = DateTime.local({ zone: timeZone }).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const dateQuery = searchParams.get("date");
  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
      : today;

  const [month, setMonth] = useState(expressInJsDate(date.startOf("month")));

  useEffect(() => {
    if (!isOpen) {
      const dateTimeMonth = DateTime.fromJSDate(month);

      if (
        dateTimeMonth.month !== date.month ||
        dateTimeMonth.year !== date.year
      ) {
        setTimeout(() => {
          setMonth(expressInJsDate(date.startOf("month")));
        }, 150);
      }
    }
  }, [date, isOpen, month]);

  const handleTodayButtonClick = () => {
    setMonth(expressInJsDate(today.startOf("month")));
  };

  const handleSelect = (systemZoneDate: Date | undefined) => {
    if (!systemZoneDate) {
      return;
    }

    const date = DateTime.fromJSDate(systemZoneDate).setZone(timeZone, {
      keepLocalTime: true,
    });

    const isoDate = date.toISODate();

    if (isoDate) {
      const params = new URLSearchParams(searchParams);
      params.set("date", isoDate);
      router.push(`${pathname}?${params.toString()}`);
    }

    setIsOpen(false);
  };

  const disabled = (systemZoneDate: Date) => {
    const date = DateTime.fromJSDate(systemZoneDate).setZone(timeZone, {
      keepLocalTime: true,
    });

    return date > tomorrow;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <DatePickerTriggerButton timeZone={timeZone} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <Calendar
          today={expressInJsDate(today)}
          month={month}
          onMonthChange={setMonth}
          mode="single"
          selected={expressInJsDate(date)}
          onSelect={handleSelect}
          className="p-2"
          classNames={{
            caption_label: "text-base font-medium",
            caption: "flex justify-between items-center pl-[10px]",
            nav_button: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "",
            nav_button_next: "",
            head_cell:
              "text-muted-foreground rounded-md w-10 font-normal text-xs",
            row: "flex w-full mt-2",
            cell: "h-10 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50  first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-10 w-10 p-0 font-normal aria-selected:opacity-100"
            ),
          }}
          initialFocus
          disabled={disabled}
        />
        <DropdownMenuSeparator />
        <div className="px-2 flex justify-end space-x-1">
          {/* TODO: Consider adding today pointing arrow */}
          <Button
            variant="outline"
            className="text-sm"
            onClick={handleTodayButtonClick}
          >
            Today
          </Button>

          {/* TODO: Add tomorrow button */}
          {/* <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleTodayButtonClick}
          >
            Tomorrow
          </Button> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DatePickerSkeleton = () => {
  return <Skeleton className="w-[148px] h-[40px] rounded-md" />;
};

export default DatePicker;

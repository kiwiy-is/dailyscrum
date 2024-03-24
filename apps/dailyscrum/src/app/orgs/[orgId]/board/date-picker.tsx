"use client";

import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { cn } from "ui";
import { Button, buttonVariants } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "ui/dropdown-menu";
import { Calendar } from "ui/shadcn-ui/calendar";

type Props = {
  timeZone: string;
};

const DatePicker = ({ timeZone }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dateQuery = searchParams.get("date");

  const today = DateTime.local().setZone(timeZone).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery)
      : today;

  const handleTodayButtonClick = () => {
    const todayInISO = today.toISODate();
    if (todayInISO) {
      const params = new URLSearchParams(searchParams);
      params.set("date", todayInISO);
      router.push(`${pathname}?${params.toString()}`);
    }
    setIsOpen(false);
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
        <Button variant="outline" size="sm" className="gap-x-2 text-xs h-8">
          <CalendarIcon width={14} height={14} strokeWidth={2} />

          <span>{date.toLocaleString(DateTime.DATE_FULL)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <Calendar
          mode="single"
          selected={date.toJSDate()}
          classNames={{
            caption_label: "text-sm font-medium",
            nav_button: cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-0",
            nav_button_next: "absolute right-0",
            head_cell:
              "text-muted-foreground rounded-md w-8 font-normal text-xs",
            row: "flex w-full mt-2",
            cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              buttonVariants({ variant: "ghost" }),
              "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs"
            ),
          }}
          onSelect={handleSelect}
          initialFocus
          disabled={disabled}
        />
        <DropdownMenuSeparator />
        <div className="px-2 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-8"
            onClick={handleTodayButtonClick}
          >
            Today
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DatePicker;

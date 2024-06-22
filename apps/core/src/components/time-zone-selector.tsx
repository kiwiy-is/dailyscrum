"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { DateTime } from "luxon";
import React, { createRef, useEffect, useRef, useState } from "react";
import { cn } from "ui";
import { Button } from "ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "ui/shadcn-ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "ui/command";
import { ScrollArea } from "ui/shadcn-ui/scroll-area";

type Props = {
  value: string;
  onSelect: (value: string) => void;
};

const TimeZoneSelector = ({ value, onSelect }: Props) => {
  const [open, setOpen] = useState(false);

  const timeZones = Intl.supportedValuesOf("timeZone")
    .map((timeZone) => {
      const offset = DateTime.local({ zone: timeZone }).toFormat("ZZ");
      return {
        label: `${timeZone.replace(/_/g, " ")} (GMT${offset})`,
        value: timeZone,
        offset,
      };
    })
    .toSorted((a, b) => a.offset.localeCompare(b.offset));

  const refs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const formTimeZoneValue = value;

  useEffect(() => {
    if (open) {
      if (value) {
        setTimeout(() => {
          // I don't understand this, but it works.
          // TODO: find out why this works
          const ref = refs.current[value!];
          if (ref && ref.current) {
            ref.current.scrollIntoView({});
          }
        }, 0);
      }
    }
  }, [open, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          className={cn(
            "justify-between h-10 font-normal",
            !value && "text-muted-foreground"
          )}
        >
          {value
            ? timeZones.find((timeZone) => timeZone.value === value)?.label
            : "Select time zone"}

          <ChevronsUpDownIcon
            className="ml-auto h-4 w-4 shrink-0 opacity-50"
            strokeWidth={2}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" min-w-[360px] p-0" align="start">
        <Command value={value}>
          <CommandInput placeholder="Search time zone..." />
          <CommandEmpty>No time zone found.</CommandEmpty>
          <CommandGroup className="">
            <ScrollArea className="h-[280px]">
              {timeZones.map((timeZone) => {
                const isSelected = timeZone.value === value;

                if (!refs.current[timeZone.value]) {
                  refs.current[timeZone.value] = createRef<HTMLDivElement>();
                }

                return (
                  <CommandItem
                    value={timeZone.label}
                    key={timeZone.value}
                    ref={refs.current[timeZone.value]}
                    onSelect={() => {
                      onSelect(timeZone.value);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {timeZone.label}
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimeZoneSelector;

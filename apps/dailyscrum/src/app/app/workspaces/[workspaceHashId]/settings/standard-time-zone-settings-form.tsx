"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { DateTime } from "luxon";
import { createRef, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "ui";
import { Button } from "ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "ui/command";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "ui/shadcn-ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "ui/shadcn-ui/popover";
import { ScrollArea } from "ui/shadcn-ui/scroll-area";
import { z } from "zod";

type Props = {};

const formSchema = z.object({
  timeZone: z.string().min(1),
});

// TODO: pass in data
// TODO: restrict update to workspace owner and admin & explain when it's disabled
const StandardTimeZoneSettingsForm = (props: Props) => {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone: "",
    },
  });

  const timeZones = Intl.supportedValuesOf("timeZone")
    .map((timeZone) => {
      const offset = DateTime.local({ zone: timeZone }).toFormat("ZZ");
      return {
        label: `(GMT${offset}) ${timeZone.replace(/_/g, " ")}`,
        value: timeZone,
        offset,
      };
    })
    .toSorted((a, b) => a.offset.localeCompare(b.offset));

  const refs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          form.handleSubmit((values) => {
            console.log(values);
          })(event);
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Time zone</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        size="sm"
                        className={cn(
                          "justify-between h-10 font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? timeZones.find(
                              (timeZone) => timeZone.value === field.value
                            )?.label
                          : "Select time zone"}

                        <ChevronsUpDownIcon
                          className="ml-auto h-4 w-4 shrink-0 opacity-50"
                          strokeWidth={2}
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" min-w-[360px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search time zone..." />
                      <CommandEmpty>No time zone found.</CommandEmpty>
                      <CommandGroup className="">
                        <ScrollArea className="h-[280px]">
                          {timeZones.map((timeZone) => {
                            const isSelected = timeZone.value === field.value;

                            if (!refs.current[timeZone.value]) {
                              refs.current[timeZone.value] =
                                createRef<HTMLDivElement>();
                            }

                            return (
                              <CommandItem
                                value={timeZone.label}
                                key={timeZone.value}
                                ref={refs.current[timeZone.value]}
                                onSelect={() => {
                                  form.setValue("timeZone", timeZone.value);
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
                <FormDescription>
                  The standard time zone for the workspace. All dates and times
                  of are considered to be in this time zone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" size="sm" loading={false}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default StandardTimeZoneSettingsForm;

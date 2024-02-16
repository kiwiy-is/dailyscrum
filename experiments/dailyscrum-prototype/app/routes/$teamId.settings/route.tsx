import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Outlet,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from "~/lib/shadcn/ui";
import { sessionStorage } from "~/sessions";
import * as db from "~/lib/db";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/shadcn/lib/utils";

import { format, utcToZonedTime } from "date-fns-tz";
import { createRef, useEffect, useRef, useState } from "react";
import { useToast } from "~/lib/shadcn/ui/use-toast";
import { getTeamTimeZone } from "~/lib/route-util";

function getGmtOffsetNumeric(timeZone: string) {
  const zonedTime = utcToZonedTime(new Date().toISOString(), timeZone);
  const offsetString = format(zonedTime, "xx", { timeZone }); // +0800
  return Number(offsetString);
}

function getGmtOffsetString(timeZone: string) {
  const zonedTime = utcToZonedTime(new Date().toISOString(), timeZone);
  return format(zonedTime, "O", { timeZone }); // GMT+8
}

const timeZones = Intl.supportedValuesOf("timeZone")
  .map((timeZone) => ({
    label: `(${getGmtOffsetString(timeZone)}) ${timeZone.replace(/_/g, " ")}`,
    value: timeZone,
    offset: getGmtOffsetNumeric(timeZone),
  }))
  .sort((a, b) => a.offset - b.offset);

export async function loader(args: LoaderFunctionArgs) {
  const { request, params } = args;

  const timeZone = getTeamTimeZone(params.teamId!);

  return json({
    settings: {
      timeZone,
    },
  });
}

export async function action(args: ActionFunctionArgs) {
  const { request, params } = args;

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  formData.delete("_action");

  switch (_action) {
    case "updateSettings": {
      const { timeZone } = Object.fromEntries(formData);

      const teamSetting = db.teamSettings.findOne({
        attributeKey: "timeZone",
        teamId: params.teamId,
      });

      if (!teamSetting) {
        throw new Response(null, {
          status: 404,
        });
      }

      teamSetting.attributeValue = String(timeZone);

      return json({
        success: true,
      });
    }
  }
}

const formSchema = zod.object({
  timeZone: zod.string(),
});

export default function () {
  const [open, setOpen] = useState(false);

  const fetcher = useFetcher<typeof action>();

  const isLoading = fetcher.state !== "idle";

  const { settings } = useLoaderData<typeof loader>();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      timeZone: settings.timeZone ?? "",
    },
  });

  const formTimeZoneValue = form.getValues("timeZone");

  const refs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (formTimeZoneValue) {
        setTimeout(() => {
          // I don't understand this, but it works.
          // TODO: find out how ref timing works
          const ref = refs.current[formTimeZoneValue!];
          if (ref && ref.current) {
            console.log(ref.current);
            ref.current.scrollIntoView({});
          }
        }, 0);
      }
    }
  }, [open, formTimeZoneValue]);

  useEffect(() => {
    if (fetcher.data && fetcher.data.success) {
      toast({
        title: "Settings updated",
        description: "Your team settings have been updated.",
      });
    }
  }, [fetcher.data, toast]);

  return (
    <>
      <div className="py-6 px-6 flex flex-col gap-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your team settings.
          </p>
        </div>

        <Separator className="" />

        <Form {...form}>
          <form
            method="post"
            className="space-y-8 max-w-[672px]"
            onSubmit={(event) => {
              form.handleSubmit((values) => {
                fetcher.submit(
                  {
                    ...values,
                    _action: "updateSettings",
                  },
                  {
                    method: "POST",
                  }
                );
              })(event);
            }}
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
                            className={cn(
                              "w-[360px] justify-between h-9 font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? timeZones.find(
                                  (timeZone) => timeZone.value === field.value
                                )?.label
                              : "Select time zone"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" w-[360px] p-0">
                        <Command>
                          <CommandInput placeholder="Search time zone..." />
                          <CommandEmpty>No timezone found.</CommandEmpty>
                          <CommandGroup className="max-h-[360px] overflow-auto">
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
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      This sets your team's default time zone. It is applied to
                      the dates in daily scrum updates.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" size="sm" disabled={isLoading}>
              {/* TOOD: WORK ON THIS */}
              {isLoading ? "Loading..." : "Update settings"}
            </Button>
          </form>
        </Form>
      </div>
      <Outlet />
    </>
  );
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { Masonry } from "~/components";
import * as zod from "zod";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  Separator,
  Form,
  FormField,
  FormItem,
  FormLabel,
  DropdownMenuCheckboxItem,
  FormControl,
  Calendar,
} from "~/lib/shadcn/ui";
import * as db from "~/lib/db";
import AddUpdateCardButton from "./add-update-card-button";
import ScrumUpdateCard from "./scrum-update-card";
import MarkdownIt from "markdown-it";
import { getSession, getTeamTimeZone, getUser } from "~/lib/route-util";
import { DateTime } from "luxon";
import {
  CalendarIcon,
  ChevronDownIcon,
  ListFilterIcon,
  Settings2Icon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/shadcn/lib/utils";
import { useEffect, useState } from "react";

const UI = {
  DASHBOARD: "dashboard",
} as const;

const markdownIt = new MarkdownIt("zero").enable(["list"]);

async function getTeamDailyScrumUpdateEntries(teamId: string, date: DateTime) {
  return db.dailyScrumUpdateEntries.where((data) => {
    const teamDailyScrumUpdate = db.teamDailyScrumUpdates.findOne({
      id: data.teamDailyScrumUpdateId,
    });

    return (
      teamDailyScrumUpdate?.teamId === teamId &&
      DateTime.fromISO(data.date).hasSame(date, "day")
    );
  });
}

async function populateEntry(dailyScrumUpdateEntry: db.DailyScrumUpdateEntry) {
  const submittedUser = getUser(dailyScrumUpdateEntry.submittedUserId);

  const answers = db.dailyScrumUpdateAnswers
    .where((data) => {
      return data.dailyScrumUpdateEntryId === dailyScrumUpdateEntry.id;
    })
    .map((scrumUpdateAnswer) => {
      const scrumUpdateQuestion = db.dailyScrumUpdateQuestions.findOne({
        id: scrumUpdateAnswer.dailyScrumUpdateQuestionId,
      });

      return {
        ...scrumUpdateAnswer,
        scrumUpdateQuestion,
        answer: markdownIt.render(scrumUpdateAnswer.answer),
      };
    });

  return {
    ...dailyScrumUpdateEntry,
    submittedUser,
    answers,
  };
}

export async function loader(args: LoaderFunctionArgs) {
  const { request, params } = args;
  const session = await getSession(request);

  const teamId = params.teamId!;

  const url = new URL(request.url);
  const dateQuery = url.searchParams.get("date");

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery)
      : DateTime.now().setZone(getTeamTimeZone(teamId)).startOf("day");

  const [sessionUser, populatedDailyScrumUpdateEntries] = await Promise.all([
    getUser(session.get("userId")!),
    await Promise.all(
      (await getTeamDailyScrumUpdateEntries(teamId, date)).map(populateEntry)
    ),
  ]);

  return json({
    [UI.DASHBOARD]: {
      dailyScrumUpdateEntries: populatedDailyScrumUpdateEntries,
      sessionUser,
      timeZone: getTeamTimeZone(teamId),
    },
  });
}

export async function action() {}

const filtersFormSchema = zod.object({
  date: zod.date(),
});

const viewOptionsFormSchema = zod.object({
  groupBy: zod.enum(["members", "questions"]),
  layout: zod.enum(["grid", "table"]),
  questionFormat: zod.enum(["original", "condensed"]),
});

export default function () {
  const {
    [UI.DASHBOARD]: { dailyScrumUpdateEntries, sessionUser, timeZone },
  } = useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();

  const dateQuery = searchParams.get("date");

  const today = DateTime.local().setZone(timeZone).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery)
      : today;

  const isToday = date?.hasSame(today, "day");
  const isTomorrow = date?.hasSame(tomorrow, "day");

  const hasSessionUserSubmittedScrumUpdate = dailyScrumUpdateEntries.some(
    (entry) => entry.submittedUserId === sessionUser?.id
  );

  const filtersForm = useForm<zod.infer<typeof filtersFormSchema>>({
    resolver: zodResolver(filtersFormSchema),
    defaultValues: {
      date: DateTime.now().toUTC().toJSDate(),
    },
  });

  const viewOptionsForm = useForm<zod.infer<typeof viewOptionsFormSchema>>({
    resolver: zodResolver(viewOptionsFormSchema),
    defaultValues: {
      groupBy: "members",
      layout: "grid",
      questionFormat: "original",
    },
  });

  useEffect(() => {
    const subscription = filtersForm.watch((value, { name, type }) => {
      filtersForm.handleSubmit((data) => {
        const date = DateTime.fromJSDate(data.date);
        const isoDate = date.toISODate();

        setSearchParams((prevParams) => {
          if (date.hasSame(today, "day")) {
            prevParams.delete("date");
          } else if (isoDate) {
            prevParams.set("date", isoDate);
          }
          return prevParams;
        });
      })();
    });
    return () => subscription.unsubscribe();
  }, [filtersForm, filtersForm.watch, isToday, setSearchParams, today]);

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateFieldPopoverOpen, setIsDateFieldPopoverOpen] = useState(false);

  return (
    <>
      <div className="py-6 px-6 flex flex-col gap-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <div>
            <p className="text-sm text-muted-foreground">
              See the team's daily scrum updates.
            </p>
          </div>
        </div>

        <Separator className="" />

        <div className="flex justify-between max-w-[552px] min-[1157px]:max-w-[836px] min-[1441px]:max-w-[1120px] min-[1725px]:max-w-[1404px]">
          <div className="flex items-center gap-x-1">
            {/* <div className="text-base font-bold">
              {date.toLocaleString(DateTime.DATE_FULL)}
            </div> */}

            <DropdownMenu
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  // variant="outline"
                  // variant={isToday ? "ghost" : "default"}
                  variant="ghost"
                  size="sm"
                  className="text-base font-semibold"
                >
                  {date.toLocaleString(DateTime.DATE_FULL)}
                  <ChevronDownIcon size={16} className="ml-2" />
                </Button>
                {/* <Button variant="ghost" size="icon-sm" className="w-6 h-6">
                  <ChevronDownIcon size={16} />
                </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                // className="w-auto p-0"
                align="center"
              >
                <Calendar
                  mode="single"
                  selected={date.toJSDate()}
                  onSelect={(systemZoneDate) => {
                    if (!systemZoneDate) {
                      return;
                    }

                    const date = DateTime.fromJSDate(systemZoneDate).setZone(
                      timeZone,
                      {
                        keepLocalTime: true,
                      }
                    );

                    // const date = DateTime.fromJSDate(data.date);
                    const isoDate = date.toISODate();

                    setSearchParams((prevParams) => {
                      if (date.hasSame(today, "day")) {
                        prevParams.delete("date");
                      } else if (isoDate) {
                        prevParams.set("date", isoDate);
                      }
                      return prevParams;
                    });
                    // field.onChange(date.toJSDate());

                    setIsDatePickerOpen(false);
                  }}
                  initialFocus
                  disabled={(systemZoneDate) => {
                    const date = DateTime.fromJSDate(systemZoneDate).setZone(
                      timeZone,
                      {
                        keepLocalTime: true,
                      }
                    );

                    return date > tomorrow;
                  }}
                />
                <DropdownMenuSeparator />
                <div className="px-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // field.onChange(today.toJSDate());
                      // setIsDateFieldPopoverOpen(false);

                      setSearchParams((prevParams) => {
                        prevParams.delete("date");
                        return prevParams;
                      });
                      setIsDatePickerOpen(false);
                    }}
                  >
                    Today
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex justify-between gap-x-2">
            <div className="flex gap-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant={!isToday ? "default" : "outline"}
                    size="sm"
                    className="gap-1"
                  >
                    <ListFilterIcon size={16} className="mr-1" />
                    Filters
                    {!isToday && (
                      <div className="bg-white h-4 w-4 rounded-full text-primary font-bold text-[10px] leading-[16px]">
                        1
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
                  <DropdownMenuLabel>Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Form {...filtersForm}>
                    <form className="px-2 py-1.5 space-y-4">
                      <FormField
                        control={filtersForm.control}
                        name="date"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col">
                              <FormLabel
                                className={cn(field.disabled && "opacity-50")}
                              >
                                Date
                              </FormLabel>
                              <DropdownMenu
                                open={isDateFieldPopoverOpen}
                                onOpenChange={setIsDateFieldPopoverOpen}
                              >
                                <DropdownMenuTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "justify-between h-9 font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {DateTime.fromJSDate(field.value)
                                        .setLocale("en-US")
                                        .toLocaleString(DateTime.DATE_FULL)}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  // className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(systemZoneDate) => {
                                      if (!systemZoneDate) {
                                        return;
                                      }

                                      const date = DateTime.fromJSDate(
                                        systemZoneDate
                                      ).setZone(timeZone, {
                                        keepLocalTime: true,
                                      });

                                      field.onChange(date.toJSDate());

                                      setIsDateFieldPopoverOpen(false);
                                    }}
                                    initialFocus
                                    disabled={(systemZoneDate) => {
                                      const date = DateTime.fromJSDate(
                                        systemZoneDate
                                      ).setZone(timeZone, {
                                        keepLocalTime: true,
                                      });

                                      return date > tomorrow;
                                    }}
                                  />
                                  <DropdownMenuSeparator />
                                  <div className="px-2 flex justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        field.onChange(today.toJSDate());
                                        setIsDateFieldPopoverOpen(false);
                                      }}
                                    >
                                      Today
                                    </Button>
                                  </div>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormItem>
                          );
                        }}
                      />
                    </form>
                  </Form>
                  <DropdownMenuSeparator />
                  <div className="px-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        filtersForm.reset();
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    <Settings2Icon size={16} className="mr-1" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
                  <DropdownMenuLabel>View settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Form {...viewOptionsForm}>
                    <form className="px-2 py-1.5 space-y-4">
                      <FormField
                        disabled
                        control={viewOptionsForm.control}
                        name="groupBy"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col">
                              <FormLabel
                                className={cn(field.disabled && "opacity-50")}
                              >
                                Group by
                              </FormLabel>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <FormControl>
                                    <Button
                                      disabled={field.disabled}
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "justify-between h-9 font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value === "members" && "Members"}
                                      {field.value === "questions" &&
                                        "Questions"}
                                    </Button>
                                  </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "members"}
                                    onCheckedChange={() => {
                                      field.onChange("members");
                                    }}
                                  >
                                    Members
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "questions"}
                                    onCheckedChange={() => {
                                      field.onChange("questions");
                                    }}
                                  >
                                    Questions
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        disabled
                        control={viewOptionsForm.control}
                        name="layout"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col">
                              <FormLabel
                                className={cn(field.disabled && "opacity-50")}
                              >
                                Layout
                              </FormLabel>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      disabled={field.disabled}
                                      size="sm"
                                      className={cn(
                                        "justify-between h-9 font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value === "grid" && "Grid"}
                                      {field.value === "table" && "Table"}
                                    </Button>
                                  </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "grid"}
                                    onCheckedChange={() => {
                                      field.onChange("grid");
                                    }}
                                  >
                                    Grid
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "table"}
                                    onCheckedChange={() => {
                                      field.onChange("table");
                                    }}
                                  >
                                    Table
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormItem>
                          );
                        }}
                      />

                      <FormField
                        control={viewOptionsForm.control}
                        name="questionFormat"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex flex-col">
                              <FormLabel>Question format</FormLabel>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className={cn(
                                        "justify-between h-9 font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value === "original" && "Original"}
                                      {field.value === "condensed" &&
                                        "Condensed"}
                                    </Button>
                                  </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "original"}
                                    onCheckedChange={() => {
                                      field.onChange("original");
                                    }}
                                  >
                                    Original
                                  </DropdownMenuCheckboxItem>
                                  <DropdownMenuCheckboxItem
                                    checked={field.value === "condensed"}
                                    onCheckedChange={() => {
                                      field.onChange("condensed");
                                    }}
                                  >
                                    Condensed
                                  </DropdownMenuCheckboxItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormItem>
                          );
                        }}
                      />
                    </form>
                  </Form>
                  <DropdownMenuSeparator />
                  <div className="px-2 flex justify-end">
                    <Button variant="outline" size="sm">
                      Back to default
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* e.g. For min-[1157px]:max-w-[836px], 836 + 24(padding) + 24(padding) + 1(horizontal line) + 272(sidebar) */}
        <div className="max-w-[552px] min-[1157px]:max-w-[836px] min-[1441px]:max-w-[1120px] min-[1725px]:max-w-[1404px]">
          <Masonry
            config={{
              columns: [2, 3, 4, 5],
              gap: [16, 16, 16, 16],
              media: [1157, 1441, 1725, 10000],
            }}
            items={[
              ...(hasSessionUserSubmittedScrumUpdate || !(isToday || isTomorrow)
                ? []
                : ["submit-update-scrum-update-card"]),
              ...dailyScrumUpdateEntries,
            ]}
            render={(item) => {
              if (typeof item === "string") {
                return (
                  <AddUpdateCardButton key="submit-update-scrum-update-card" />
                );
              }

              return (
                <ScrumUpdateCard
                  key={item.id}
                  id={item.id}
                  submittedUser={item.submittedUser}
                  answers={item.answers}
                />
              );
            }}
          />
        </div>
      </div>
      <Outlet />
    </>
  );
}

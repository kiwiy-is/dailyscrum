"use client";

import { useCallback, useEffect, useMemo, useRef, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "ui/shadcn-ui/form";
import { Button, buttonVariants } from "ui/button";
import { cn } from "ui";

import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "ui/shadcn-ui/popover";
import { Calendar } from "ui/shadcn-ui/calendar";
import { Textarea } from "ui/shadcn-ui/textarea";

import * as zod from "zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { CalendarIcon, CheckCircleIcon } from "lucide-react";
import { DateTime } from "luxon";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useToast } from "ui/shadcn-ui/use-toast";
import { addUpdate } from "./actions";
import { createBrowserClient } from "@/lib/supabase/browser-client";
import {
  expressInJsDate,
  formatDateAddYearIfDifferent,
  getGmtOffset,
} from "@/lib/date-time";

type DynamicFormValues = { [x: string]: string };
type FormValues = { date: Date };

const DateField: React.FC<{
  field: ControllerRenderProps<
    {
      date: Date;
    },
    "date"
  >;
  today: DateTime<true> | DateTime<false>;
  timeZone: string;
}> = ({ field, today, timeZone }) => {
  const selected = useMemo(() => field.value, [field.value]);

  const tomorrow = useMemo(() => today.plus({ days: 1 }), [today]);

  const formattedDate = useMemo(() => {
    return formatDateAddYearIfDifferent(
      DateTime.fromJSDate(selected).setLocale("en-US"),
      today
    );
  }, [selected, today]);

  const gmtOffset = useMemo(() => {
    return getGmtOffset(timeZone);
  }, [timeZone]);

  const handleSelect = useCallback(
    (systemZoneDate: Date | undefined) => {
      if (!systemZoneDate) {
        return;
      }

      const date = DateTime.fromJSDate(systemZoneDate).setZone(timeZone, {
        keepLocalTime: true,
      });

      field.onChange(expressInJsDate(date));
    },
    [field, timeZone]
  );

  const disabled = useCallback(
    (systemZoneDate: Date) => {
      const date = DateTime.fromJSDate(systemZoneDate).setZone(timeZone, {
        keepLocalTime: true,
      });

      return date < today || date > tomorrow;
    },
    [today, tomorrow, timeZone]
  );

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Date</FormLabel>
      <FormControl>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className="w-full sm:!w-[240px] font-normal h-10"
              >
                <div className="flex gap-x-2">
                  <span>{formattedDate}</span>
                  <span className="text-muted-foreground">({gmtOffset})</span>
                </div>
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              today={expressInJsDate(today)}
              mode="single"
              selected={selected}
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
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormDescription>
        Select a date for your daily scrum update. You can choose either today
        or tomorrow.
      </FormDescription>
      <FormMessage />
    </FormItem>
  );
};

type Question = {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;
  isRequired: boolean;
  maxLength?: number;
};

export interface AddUpdateDialogContentProps {
  dailyScrumUpdateFormId: number;
  description: string;
  questions: Question[];
  timeZone: string;
  hasAddedDailyScrumUpdateForToday: boolean;
  hasAddedDailyScrumUpdateForTomorrow: boolean;
}

const AddUpdateDialogContent: React.FC<AddUpdateDialogContentProps> = ({
  dailyScrumUpdateFormId,
  description,
  questions,
  timeZone,
  hasAddedDailyScrumUpdateForToday,
  hasAddedDailyScrumUpdateForTomorrow,
}) => {
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ workspaceHashId: string }>();
  const searchParams = useSearchParams();

  const today = DateTime.local({ zone: timeZone }).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const formSchema = useMemo(() => {
    return zod.object({
      date: zod
        .date()
        .refine(
          (date) => {
            const selectedDate = DateTime.fromJSDate(date);
            return !(
              selectedDate.hasSame(today, "day") &&
              hasAddedDailyScrumUpdateForToday
            );
          },
          {
            message:
              "You have already added a daily scrum update for today. Only one update can be added for each day.",
          }
        )
        .refine(
          (date) => {
            const selectedDate = DateTime.fromJSDate(date);
            return !(
              selectedDate.hasSame(tomorrow, "day") &&
              hasAddedDailyScrumUpdateForTomorrow
            );
          },
          {
            message:
              "You have already added a daily scrum update for tomorrow. Only one update can be added for each day.",
          }
        ),
    });
  }, [
    hasAddedDailyScrumUpdateForToday,
    hasAddedDailyScrumUpdateForTomorrow,
    today,
    tomorrow,
  ]);

  const dynamicFormSchema = useMemo(() => {
    return zod.object(
      Object.fromEntries(
        questions.map((question) => [
          question.id,
          zod
            .string()
            .min(
              question.isRequired ? 1 : 0,
              question.isRequired ? { message: "This field is required." } : {}
            ),
        ])
      )
    );
  }, [questions]);

  const dateQuery = searchParams.get("date");

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
      : today;

  const isDateArchived = !(
    date.hasSame(today, "day") || date.hasSame(tomorrow, "day")
  );

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: isDateArchived ? expressInJsDate(today) : expressInJsDate(date),
    },
  });

  useEffect(() => {
    // TODO: There is a code duplicate. Refactor it.
    const today = DateTime.local({ zone: timeZone }).startOf("day");
    const tomorrow = today.plus({ days: 1 });
    const date =
      dateQuery && DateTime.fromISO(dateQuery).isValid
        ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
        : today;

    const isDateArchived = !(
      date.hasSame(today, "day") || date.hasSame(tomorrow, "day")
    );

    // TODO: form.setValue didn't trigger rendering. Find out why.
    form.reset({
      date: isDateArchived ? expressInJsDate(today) : expressInJsDate(date),
    });
  }, [dateQuery, timeZone, form]);

  useEffect(() => {
    form.trigger("date");
  }, [form]);

  const formDate = form.watch("date");

  useEffect(() => {
    form.trigger("date");
  }, [form, formDate]);

  const dynamicForm = useForm<zod.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
  });

  useEffect(() => {
    form.reset();
    dynamicForm.reset();
  }, [dynamicForm, form]);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let resolveForm: (value: FormValues) => void;
    let resolveDynamicForm: (value: DynamicFormValues) => void;

    const formPromise = new Promise<FormValues>((resolve) => {
      resolveForm = resolve;
    });

    const dynamicFormPromise = new Promise<DynamicFormValues>((resolve) => {
      resolveDynamicForm = resolve;
    });

    form.handleSubmit((values) => {
      resolveForm(values);
    })(event);

    dynamicForm.handleSubmit((values) => {
      resolveDynamicForm(values);
    })(event);

    Promise.all([dynamicFormPromise, formPromise]).then(
      ([dynamicFormValues, formValues]) => {
        startTransition(async () => {
          const dateString = DateTime.fromJSDate(formValues.date).toISODate()!;

          const mergedValues = {
            date: dateString,
            ...dynamicFormValues,
          };

          // TODO: handle error. Maybe trigger a toast?
          const { error } = await addUpdate(
            params.workspaceHashId,
            dailyScrumUpdateFormId,
            timeZone,
            mergedValues
          );

          const browserClient = createBrowserClient();
          const channel = browserClient.channel(
            `workspaces/${params.workspaceHashId}`
          );
          channel.subscribe((status) => {
            if (status !== "SUBSCRIBED") {
              return null;
            }

            channel.send({
              type: "broadcast",
              event: "updateAdd",
              payload: {
                message: JSON.stringify({
                  date: dateString,
                }),
              },
            });
          });

          const dateQuery = searchParams.get("date");
          const currentDate = dateQuery ? DateTime.fromISO(dateQuery) : today;
          const date = DateTime.fromISO(dateString);

          if (date.hasSame(currentDate, "day")) {
            router.push(
              `/app/workspaces/${
                params.workspaceHashId
              }/board?${searchParams.toString()}`
            );
            router.refresh();
          } else {
            const mutableSearchParams = new URLSearchParams(searchParams);
            mutableSearchParams.set("date", date.toISODate()!);
            router.push(
              `/app/workspaces/${
                params.workspaceHashId
              }/board?${mutableSearchParams.toString()}`
            );
            router.refresh();
          }

          toast({
            description: (
              <div className="flex items-center gap-x-2">
                <CheckCircleIcon size={16} />
                <span>Successfully added a daily scrum update</span>
              </div>
            ),
          });
        });
      }
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add a daily scrum update</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <form
        method="post"
        id="scrum-update-form"
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <Form {...form}>
          <FormField
            control={form.control}
            name={"date"}
            key={"date"}
            render={({ field, fieldState }) => {
              return (
                <DateField field={field} today={today} timeZone={timeZone} />
              );
            }}
          />
        </Form>
        <Form {...dynamicForm}>
          {questions.map((question) => {
            return (
              <FormField
                control={dynamicForm.control}
                name={question.id}
                key={question.id}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{question.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={question.placeholder}
                        {...field}
                        className="min-h-[104px]"
                      />
                    </FormControl>
                    <FormDescription>{question.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </Form>
      </form>

      <DialogFooter>
        <Button type="submit" form="scrum-update-form" loading={isPending}>
          Add update
        </Button>
      </DialogFooter>
    </>
  );
};

export default AddUpdateDialogContent;

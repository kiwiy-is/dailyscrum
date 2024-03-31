"use client";

import { useCallback, useEffect, useMemo, useTransition } from "react";
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
import { Button } from "ui/button";
import {
  Dialog,
  DialogContent,
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
import { usePathname, useSearchParams } from "next/navigation";
import { addUpdate } from "./actions";
import { useToast } from "ui/shadcn-ui/use-toast";

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
    return DateTime.fromJSDate(selected)
      .setLocale("en-US")
      .toLocaleString(DateTime.DATE_FULL);
  }, [selected]);

  const handleSelect = useCallback(
    (systemZoneDate: Date | undefined) => {
      if (!systemZoneDate) {
        return;
      }

      const date = DateTime.fromJSDate(systemZoneDate).setZone(timeZone, {
        keepLocalTime: true,
      });

      field.onChange(date.toJSDate());
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
                size="sm"
                className="w-[240px] font-normal h-10"
              >
                {formattedDate}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selected}
              onSelect={handleSelect}
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

export interface AddScrumUpdateDialogProps {
  dailyScrumUpdateFormId: number;
  description: string;
  questions: Question[];
  timeZone: string;
  hasAddedDailyScrumUpdateForToday: boolean;
  hasAddedDailyScrumUpdateForTomorrow: boolean;
}

export const AddScrumUpdateDialog: React.FC<AddScrumUpdateDialogProps> = ({
  dailyScrumUpdateFormId,
  description,
  questions,
  timeZone,
  hasAddedDailyScrumUpdateForToday,
  hasAddedDailyScrumUpdateForTomorrow,
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");

  const isOpen = dialogParamValue === "add-scrum-update";

  useEffect(() => {
    form.reset();
    dynamicForm.reset();
  }, [isOpen]);

  const today = DateTime.local().setZone(timeZone).startOf("day");
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

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: today.toJSDate(),
    },
  });

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

  const closeDialog = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete("dialog");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      closeDialog();
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
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
            const mergedValues = {
              ...formValues,
              ...dynamicFormValues,
            } as unknown as FormValues & DynamicFormValues;

            // TODO: handle error
            const { error } = await addUpdate(
              dailyScrumUpdateFormId,
              timeZone,
              mergedValues
            );

            closeDialog();
            toast({
              description: (
                <div className="flex items-center gap-x-2">
                  <CheckCircleIcon size={16} />
                  <span>Successfully added a daily scrum update.</span>
                </div>
              ),
            });
            return;
          });
        }
      );
    },
    [dynamicForm, form]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8">
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
          <Button
            type="submit"
            size="sm"
            form="scrum-update-form"
            loading={isPending}
          >
            Add update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

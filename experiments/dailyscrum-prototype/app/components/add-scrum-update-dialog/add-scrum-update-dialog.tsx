import { useCallback, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  DialogContent,
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Calendar,
} from "~/lib/shadcn/ui";

import * as zod from "zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Textarea } from "~/lib/shadcn/ui/textarea/textarea";
import { CalendarIcon } from "lucide-react";
import { DateTime } from "luxon";

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
                className="w-[240px] font-normal"
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
  placeholder: string;
  description: string;
  isRequired: boolean;
  maxLength?: number;
};

export interface AddScrumUpdateDialogProps {
  description: string;
  questions: Question[];
  timeZone: string;
  isOpen: boolean;
  isLoading: boolean;
  hasAddedDailyScrumUpdateForToday: boolean;
  hasAddedDailyScrumUpdateForTomorrow: boolean;
  onClose: () => void;
  onSave: (values: { [x: string]: string } & { date: Date }) => void;
}

export const AddScrumUpdateDialog: React.FC<AddScrumUpdateDialogProps> = ({
  description,
  questions,
  timeZone,
  isOpen,
  isLoading,
  hasAddedDailyScrumUpdateForToday,
  hasAddedDailyScrumUpdateForTomorrow,
  onClose,
  onSave,
}) => {
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
    console.log("triggered");
    form.trigger("date");
  }, [form]);

  const formDate = form.watch("date");

  useEffect(() => {
    form.trigger("date");
  }, [form, formDate]);

  const dynamicForm = useForm<zod.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
  });

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }
      onClose();
    },
    [onClose]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
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
          const mergedValues = {
            ...formValues,
            ...dynamicFormValues,
          } as unknown as FormValues & DynamicFormValues;
          console.log({ mergedValues });
          onSave(mergedValues);
        }
      );
    },
    [dynamicForm, form, onSave]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8">
        <DialogHeader>
          <DialogTitle>Add daily scrum update</DialogTitle>
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
              render={({ field }) => (
                <DateField field={field} today={today} timeZone={timeZone} />
              )}
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
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Add update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

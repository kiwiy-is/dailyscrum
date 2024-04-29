"use client";

import { useEffect, useMemo, useTransition } from "react";
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
import { Textarea } from "ui/shadcn-ui/textarea";

import * as zod from "zod";
import type { ControllerRenderProps } from "react-hook-form";
import { useForm } from "react-hook-form";
import { CalendarIcon, CheckCircleIcon } from "lucide-react";
import { DateTime } from "luxon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "ui/shadcn-ui/use-toast";
import { editUpdate } from "./actions";

export type DynamicFormValues = { [answerId: string]: string };
export type FormValues = { date: Date };

const DateField: React.FC<{
  field: ControllerRenderProps<
    {
      date: Date;
    },
    "date"
  >;
}> = ({ field }) => {
  const selected = useMemo(() => field.value, [field.value]);

  const formattedDate = useMemo(() => {
    return DateTime.fromJSDate(selected)
      .setLocale("en-US")
      .toLocaleString(DateTime.DATE_FULL);
  }, [selected]);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>Date</FormLabel>
      <FormControl>
        <Button
          variant={"outline"}
          className="w-[240px] font-normal h-10"
          disabled
        >
          {formattedDate}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

type Question = {
  id: number;
  label: string;
  placeholder?: string;
  description?: string;
  isRequired: boolean;
  maxLength?: number;
};

type Answer = {
  id: number;
  questionId: number;
  answer: string;
};

export interface EditScrumUpdateDialogProps {
  description: string;
  questions: Question[];
  date: Date;
  answers: Answer[];
}

// TODO: Open dialog as soon as edit button is clicked. Show loading state while defaultValues are fetching.
export const EditUpdateDialog: React.FC<EditScrumUpdateDialogProps> = ({
  description,
  questions,
  date,
  answers,
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");
  const editUpdateItemIdParamValue = searchParams.get("editUpdateItemId");

  const isOpen =
    dialogParamValue === "edit-update" && Boolean(editUpdateItemIdParamValue);

  const formSchema = useMemo(() => {
    return zod.object({
      date: zod.date(),
    });
  }, []);

  // NOTE: ordered by questions order
  const answersWithQuestions = questions.map((question) => {
    const answer = answers.find((answer) => {
      return answer.questionId === question.id;
    }) as Answer;

    return {
      ...answer,
      question,
    };
  });

  const dynamicFormSchema = useMemo(() => {
    return zod.object(
      Object.fromEntries(
        answersWithQuestions.map((answer) => {
          return [
            answer.id,
            zod
              .string()
              .min(
                answer.question.isRequired ? 1 : 0,
                answer.question.isRequired
                  ? { message: "This field is required." }
                  : {}
              ),
          ];
        })
      )
    );
  }, [answersWithQuestions]);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const dynamicForm = useForm<zod.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
  });

  useEffect(() => {
    form.reset({
      date,
    });

    dynamicForm.reset(
      answers.reduce<{ [answerId: number]: string }>((acc, cv) => {
        return {
          ...acc,
          [cv.id]: cv.answer,
        };
      }, {})
    );
  }, [date, answers]);

  const closeDialog = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("dialog");
    params.delete("editUpdateItemId");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    // router.replace(`${pathname}?${params.toString()}`);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      closeDialog();
    }
  };

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
      console.log({ values });

      resolveForm(values);
    })(event);

    dynamicForm.handleSubmit((values) => {
      console.log({ values });
      resolveDynamicForm(values);
    })(event);

    Promise.all([dynamicFormPromise, formPromise]).then(
      ([dynamicFormValues, formValues]) => {
        startTransition(async () => {
          console.log({ dynamicFormValues });
          await editUpdate(dynamicFormValues);
          // TODO: The data is not properly refreshed. Fix it.
          router.refresh();

          const mutableSearchParams = new URLSearchParams(searchParams);
          mutableSearchParams.delete("dialog");
          mutableSearchParams.delete("editUpdateItemId");
          router.replace(`${pathname}?${mutableSearchParams.toString()}`);
          toast({
            description: (
              <div className="flex items-center gap-x-2">
                <CheckCircleIcon size={16} />
                <span>Successfully edited a daily scrum update.</span>
              </div>
            ),
          });
        });
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8" id={searchParams.toString()}>
        <DialogHeader>
          <DialogTitle>Edit daily scrum update</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form
          method="post"
          id="scrum-update-form"
          onSubmit={handleSubmit}
          className="space-y-8 mt-4"
        >
          <Form {...form}>
            <FormField
              control={form.control}
              name={"date"}
              key={"date"}
              render={({ field, fieldState }) => {
                return <DateField field={field} />;
              }}
            />
          </Form>
          <Form {...dynamicForm}>
            {answersWithQuestions.map((answer) => {
              const { question } = answer;
              return (
                <FormField
                  control={dynamicForm.control}
                  name={answer.id.toString()}
                  key={answer.id}
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
          <Button type="submit" form="scrum-update-form" loading={isPending}>
            Edit update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

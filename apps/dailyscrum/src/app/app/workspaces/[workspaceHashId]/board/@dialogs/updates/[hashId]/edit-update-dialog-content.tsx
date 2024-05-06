"use client";

import { useEffect, useMemo, useRef, useTransition } from "react";
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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
const EditUpdateDialogContent: React.FC<EditScrumUpdateDialogProps> = ({
  description,
  questions,
  date,
  answers,
}) => {
  const { toast } = useToast();

  const router = useRouter();
  const params = useParams<{ workspaceHashId: string }>();
  const pathname = usePathname();

  const searchParams = useSearchParams();

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
  }, [date, answers, form, dynamicForm]);

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
          await editUpdate(dynamicFormValues);

          router.push(
            `/app/workspaces/${
              params.workspaceHashId
            }/board?${searchParams.toString()}`
          );

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
    <>
      <DialogHeader>
        <DialogTitle>Edit daily scrum update</DialogTitle>
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
                      <Textarea placeholder={question.placeholder} {...field} />
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
    </>
  );
};

export default EditUpdateDialogContent;

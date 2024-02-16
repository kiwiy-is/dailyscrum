import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import * as db from "~/lib/db";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/lib/shadcn/ui";
import { Textarea } from "~/lib/shadcn/ui/textarea/textarea";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getDailyScrumUpdateEntry,
  getSession,
  validateAndGetSessionUser,
} from "~/lib/route-util";
import { DateTime } from "luxon";

const UI = {
  DIALOG: "dialog",
} as const;

const ACTIONS = {
  EDIT_DAILY_SCRUM_UPDATE: "editDailyScrumUpdate",
} as const;

async function populateEntry(dailyScrumUpdateEntry: db.DailyScrumUpdateEntry) {
  return {
    ...dailyScrumUpdateEntry,

    teamDailyScrumUpdate: db.teamDailyScrumUpdates.findOne({
      id: dailyScrumUpdateEntry.teamDailyScrumUpdateId,
    }),

    submittedUser: db.users.findOne({
      id: dailyScrumUpdateEntry.submittedUserId,
    }),

    dailyScrumUpdateAnswers: db.dailyScrumUpdateAnswers
      .where((data) => {
        return data.dailyScrumUpdateEntryId === dailyScrumUpdateEntry.id;
      })
      .map((scrumUpdateAnswer) => {
        const dailyScrumUpdateQuestion = db.dailyScrumUpdateQuestions.findOne({
          id: scrumUpdateAnswer.dailyScrumUpdateQuestionId,
        });

        return {
          ...scrumUpdateAnswer,
          dailyScrumUpdateQuestion,
        };
      }),
  };
}

function validateUserAccessToEntry(
  dailyScrumUpdateEntry: db.DailyScrumUpdateEntry,
  userId: string
) {
  if (dailyScrumUpdateEntry.submittedUserId !== userId) {
    throw new Response(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }
}

async function getDailyScrumUpdateEntryOrThrow(
  dailyScrumUpdateEntryId: string
) {
  const dailyScrumUpdateEntry = await getDailyScrumUpdateEntry(
    dailyScrumUpdateEntryId
  );

  if (!dailyScrumUpdateEntry) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return dailyScrumUpdateEntry;
}

async function handleEditDailyScrumUpdateAction(
  args: ActionFunctionArgs,
  formData: FormData
) {
  const { request, params } = args;

  const session = await getSession(request);

  const sessionUser = await validateAndGetSessionUser(session);

  const dailyScrumUpdateEntry = await getDailyScrumUpdateEntryOrThrow(
    params.id!
  );

  validateUserAccessToEntry(dailyScrumUpdateEntry, sessionUser.id);

  dailyScrumUpdateEntry.updatedAt = DateTime.now().toUTC().toISO();

  const formDataEntries = [...formData.entries()];

  for (const [key, value] of formDataEntries) {
    const dailyScrumUpdateAnswer = db.dailyScrumUpdateAnswers.findOne({
      dailyScrumUpdateEntryId: dailyScrumUpdateEntry.id,
      dailyScrumUpdateQuestionId: key,
    });

    if (!dailyScrumUpdateAnswer) {
      throw new Response(null, {
        status: 404,
        statusText: "Not found",
      });
    }

    dailyScrumUpdateAnswer.answer = String(value);
    dailyScrumUpdateAnswer.updatedAt = DateTime.now().toUTC().toISO();
  }

  return json({
    success: true,
  });
}

export async function loader(args: LoaderFunctionArgs) {
  const { request, params } = args;

  const dailyScrumUpdateEntry = await getDailyScrumUpdateEntry(params.id!);

  if (!dailyScrumUpdateEntry) {
    throw new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return json({
    [UI.DIALOG]: {
      dailyScrumUpdateEntry: await populateEntry(dailyScrumUpdateEntry),
    },
  });
}

export async function action(args: ActionFunctionArgs) {
  const { request, params } = args;

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  formData.delete("_action");

  switch (_action) {
    case ACTIONS.EDIT_DAILY_SCRUM_UPDATE: {
      return await handleEditDailyScrumUpdateAction(args, formData);
    }
  }
}

export default function () {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const fetcher = useFetcher<typeof action>();

  const [open, setOpen] = useState(true);

  const {
    [UI.DIALOG]: {
      dailyScrumUpdateEntry: {
        id,
        teamDailyScrumUpdate,
        createdAt,
        dailyScrumUpdateAnswers,
      },
    },
  } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const formSchema = useMemo(() => {
    return zod.object({
      ...Object.fromEntries(
        dailyScrumUpdateAnswers.map(
          ({ dailyScrumUpdateQuestion, dailyScrumUpdateQuestionId }) => [
            dailyScrumUpdateQuestionId,
            zod
              .string()
              .min(
                dailyScrumUpdateQuestion?.isRequired ? 1 : 0,
                dailyScrumUpdateQuestion?.isRequired
                  ? { message: "This field is required." }
                  : {}
              ),
          ]
        )
      ),
    });
  }, [dailyScrumUpdateAnswers]);

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...Object.fromEntries(
        dailyScrumUpdateAnswers.map(
          ({ dailyScrumUpdateQuestionId, answer }) => [
            dailyScrumUpdateQuestionId,
            answer,
          ]
        )
      ),
    },
  });

  const isLoading = fetcher.state !== "idle";

  const handleClose = useCallback(() => {
    if (isLoading) {
      return;
    }

    setOpen(false);
    if (
      searchParams.has("return-dialog") &&
      searchParams.get("return-dialog") === "view-scrum-update"
    ) {
      setTimeout(() => {
        navigate(`/${teamId}/dashboard/scrum-update/${id}`, {
          preventScrollReset: true,
        });
      });
    } else {
      setTimeout(() => {
        navigate(`/${teamId}/dashboard`, {
          preventScrollReset: true,
        });
      }, 150);
    }
  }, [isLoading, navigate, searchParams, teamId, id]);

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }

    if (!fetcher.data.success) {
      return;
    }

    setOpen(false);

    setTimeout(() => {
      navigate(`/${teamId}/dashboard/scrum-update/${id}`, {
        preventScrollReset: true,
      });
    }, 150); // The animation duration is 150ms
  }, [fetcher.data, navigate, teamId, id]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      form.handleSubmit((values) => {
        const { date, ...rest } = values;

        fetcher.submit(
          {
            _action: ACTIONS.EDIT_DAILY_SCRUM_UPDATE,
            ...rest,
          },
          {
            method: "POST",
          }
        );
      })(event);
    },
    [fetcher, form]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit daily scrum update</DialogTitle>
          <DialogDescription>
            {teamDailyScrumUpdate?.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            method="post"
            id="scrum-update-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {dailyScrumUpdateAnswers.map(
              ({ dailyScrumUpdateEntryId, dailyScrumUpdateQuestion }) => {
                if (!dailyScrumUpdateQuestion) {
                  return null;
                }

                return (
                  <FormField
                    control={form.control}
                    name={dailyScrumUpdateQuestion?.id}
                    key={dailyScrumUpdateQuestion?.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {dailyScrumUpdateQuestion?.question}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={dailyScrumUpdateQuestion?.placeholder}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {dailyScrumUpdateQuestion?.description}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="submit"
            size="sm"
            form="scrum-update-form"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Edit update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

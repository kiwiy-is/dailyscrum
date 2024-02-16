import { useFetcher, useLoaderData, useSearchParams } from "@remix-run/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AddScrumUpdateDialog as AddScrumUpdateDialogUI } from "~/components/add-scrum-update-dialog/add-scrum-update-dialog";
import { ACTIONS } from "./constants";
import type { action, loader } from "./route";
import { useToast } from "~/lib/shadcn/ui/use-toast";
import { DateTime } from "luxon";

export default function AddScrumUpdateDialog() {
  const {
    addScrumUpdateModal: {
      team,
      timeZone,
      hasAddedDailyScrumUpdateForToday,
      hasAddedDailyScrumUpdateForTomorrow,
    },
  } = useLoaderData<typeof loader>();

  const description = team.dailyScrumUpdate?.description ?? "";

  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  const isLoading = fetcher.state !== "idle";

  const questions = useMemo(
    () =>
      team.dailyScrumUpdateQuestions.map((question) => ({
        ...question,
        label: question.question,
      })),
    [team.dailyScrumUpdateQuestions]
  );

  const closeDialog = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      searchParams.delete("dialog");
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }, 150); // The animation duration is 150ms
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }

    if (!fetcher.data.success) {
      return;
    }

    closeDialog();
    toast({
      title: "New daily scrum update added",
      description: "Your daily scrum update has been successfully added.",
    });
  }, [closeDialog, fetcher.data, searchParams, setSearchParams, toast]);

  const handleClose = useCallback(() => {
    if (isLoading) {
      return;
    }

    closeDialog();
  }, [closeDialog, isLoading]);

  const handleSave = useCallback(
    (values: { [x: string]: string } & { date: Date }) => {
      const { date, ...dynamicFormValues } = values;

      fetcher.submit(
        {
          _action: ACTIONS.SUBMIT_SCRUM_UPDATE,
          date: DateTime.fromJSDate(date).toISODate(),
          ...dynamicFormValues,
        },
        {
          method: "POST",
        }
      );
    },
    [fetcher]
  );

  return (
    <AddScrumUpdateDialogUI
      description={description}
      questions={questions}
      timeZone={timeZone}
      isOpen={open}
      isLoading={isLoading}
      onClose={handleClose}
      onSave={handleSave}
      hasAddedDailyScrumUpdateForToday={hasAddedDailyScrumUpdateForToday}
      hasAddedDailyScrumUpdateForTomorrow={hasAddedDailyScrumUpdateForTomorrow}
    />
  );
}

import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import MarkdownIt from "markdown-it";
import { useCallback, useMemo, useState } from "react";
import * as db from "~/lib/db";

import {
  getDailyScrumUpdateEntry,
  getSession,
  getTeamTimeZone,
  getUser,
  validateAndGetSessionUser,
} from "~/lib/route-util";
import { ViewScrumUpdateDialog } from "~/components/view-scrum-update-dialog/view-scrum-update-dialog";
import { DateTime } from "luxon";

const UI = {
  DIALOG: "dialog",
} as const;

async function populateEntry(dailyScrumUpdateEntry: db.DailyScrumUpdateEntry) {
  const markdownIt = new MarkdownIt("zero").enable(["list"]);

  return {
    ...dailyScrumUpdateEntry,
    submittedUser: getUser(dailyScrumUpdateEntry.submittedUserId),
    dailyScrumUpdateAnswers: db.dailyScrumUpdateAnswers
      .where((data) => {
        return data.dailyScrumUpdateEntryId === dailyScrumUpdateEntry.id;
      })
      .map((scrumUpdateAnswer) => {
        const scrumUpdateQuestion = db.dailyScrumUpdateQuestions.findOne({
          id: scrumUpdateAnswer.dailyScrumUpdateQuestionId,
        });

        return {
          ...scrumUpdateAnswer,
          answer: markdownIt.render(scrumUpdateAnswer.answer),
          scrumUpdateQuestion,
        };
      }),
  };
}

export async function loader(args: LoaderFunctionArgs) {
  const { request, params } = args;
  const session = await getSession(request);
  const teamId = params.teamId!;

  const user = validateAndGetSessionUser(session);

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
      currentUser: user,
      teamTimeZone: getTeamTimeZone(teamId),
    },
  });
}

export default function () {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const {
    [UI.DIALOG]: { dailyScrumUpdateEntry, currentUser, teamTimeZone },
  } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(true);

  const isCurrentUserScrumUpdateEntry =
    currentUser?.id === dailyScrumUpdateEntry.submittedUser?.id;

  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(() => {
      navigate(`/${teamId}/dashboard`);
    }, 150); // The animation duration is 150ms
  }, [navigate, teamId]);

  const handleEditButtonClick = useCallback(() => {
    navigate(
      `/${teamId}/dashboard/scrum-update/${dailyScrumUpdateEntry.id}/edit?return-dialog=view-scrum-update`
    );
  }, [navigate, teamId, dailyScrumUpdateEntry.id]);

  const userName = useMemo(
    () => dailyScrumUpdateEntry.submittedUser?.name ?? "",
    [dailyScrumUpdateEntry]
  );

  const date = useMemo(() => {
    return DateTime.fromISO(dailyScrumUpdateEntry.date, {
      zone: dailyScrumUpdateEntry.timeZone,
    }).toLocaleString(DateTime.DATE_FULL);
  }, [dailyScrumUpdateEntry.date, dailyScrumUpdateEntry.timeZone]);

  const answers = useMemo(
    () =>
      dailyScrumUpdateEntry.dailyScrumUpdateAnswers.map((answer) => ({
        id: answer.id,
        question: answer.scrumUpdateQuestion?.question ?? "",
        answer: answer.answer,
      })),
    [dailyScrumUpdateEntry]
  );

  return (
    <ViewScrumUpdateDialog
      userName={userName}
      date={date}
      answers={answers}
      isOpen={open}
      isCurrentUserScrumUpdateEntry={isCurrentUserScrumUpdateEntry}
      onEditButtonClick={handleEditButtonClick}
      onClose={handleClose}
    />
  );
}

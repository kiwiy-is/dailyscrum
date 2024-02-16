import { Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import Sidebar from "./sidebar";
import Header from "./header";

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  Session,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ACTIONS, UI } from "./constants";
import SubmitScrumUpdateDialog from "./add-scrum-update-dialog";

import type { SessionData } from "~/sessions";
import { sessionStorage } from "~/sessions";
import * as db from "~/lib/db";
import { nanoid10 } from "~/lib/nanoid";
import {
  getSession,
  getTeamTimeZone,
  validateAndGetSessionUser,
  validateUserAccessToTeam,
} from "~/lib/route-util";
import { DateTime } from "luxon";

function getUsers() {
  return db.users.find().map((user) => ({
    id: user.id,
    name: user.name,
  }));
}

function getTeams(userId: string) {
  return db.teamUsers
    .where((data) => {
      return data.userId === userId;
    })
    .map((teamUser) => {
      return db.teams.findOne({
        id: teamUser.teamId,
      });
    });
}

function getTeam(teamId: string) {
  return db.teams.findOne({
    id: teamId,
  });
  // return data.teams.find((team) => team.id === teamId);
}

function getTeamDailyScrumUpdate(teamId: string) {
  const team = db.teams.findOne({
    id: teamId,
  });

  if (!team) {
    return;
  }

  return db.teamDailyScrumUpdates.findOne({
    teamId: team.id,
  });
}

function getTeamDailyScrumUpdateQuestions(teamId: string) {
  const team = db.teams.findOne({
    id: teamId,
  });

  if (!team) {
    return [];
  }

  const teamScrumUpdate = db.teamDailyScrumUpdates.findOne({
    teamId: team.id,
  });

  if (!teamScrumUpdate) {
    return [];
  }

  return db.dailyScrumUpdateQuestions.where((data) => {
    return data.teamDailyScrumUpdateId === teamScrumUpdate.id;
  });
}

function handleSelectTeamAction(formData: FormData) {
  const teamId = String(formData.get("teamId"));

  const selectedTeam = getTeam(teamId);

  if (!selectedTeam) {
    throw new Response(null, {
      status: 404,
      statusText: "Team not found",
    });
  }

  return redirect(`/${selectedTeam.id}`);
}

async function handleSubmitScrumUpdateAction(
  args: LoaderFunctionArgs,
  formData: FormData
) {
  const { request, params } = args;
  const session = await getSession(request);
  const user = validateAndGetSessionUser(session);
  validateUserAccessToTeam(params.teamId!, user.id);

  const teamDailyScrumUpdate = getTeamDailyScrumUpdate(params.teamId!);

  if (!teamDailyScrumUpdate) {
    throw new Response(null, {
      status: 404,
      statusText: "Team Scrum Update not found",
    });
  }

  const dailyScrumUpdateEntry: db.DailyScrumUpdateEntry = {
    id: nanoid10(),
    teamDailyScrumUpdateId: teamDailyScrumUpdate.id,
    submittedUserId: user.id,
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
    date: String(formData.get("date")),
    timeZone: getTeamTimeZone(params.teamId!),
  };
  db.dailyScrumUpdateEntries.insert(dailyScrumUpdateEntry);

  formData.delete("date");
  const dailyScrumUpdateAnswers = [...formData.entries()].map(
    ([key, value]) => {
      return {
        id: nanoid10(),
        dailyScrumUpdateEntryId: dailyScrumUpdateEntry.id,
        dailyScrumUpdateQuestionId: key,
        answer: String(value),
        createdAt: DateTime.utc().toISO(),
        updatedAt: DateTime.utc().toISO(),
      };
    }
  );
  db.dailyScrumUpdateAnswers.insert(dailyScrumUpdateAnswers);

  return json({
    success: true,
  });
}

function setLastVisitedTeamIdInSession(
  session: Session<SessionData, SessionData>,
  teamId: string
) {
  session.set("lastVisitedTeamId", teamId);
}

function redirectToDashboard(teamId: string) {
  return redirect(`/${teamId}/dashboard`);
}

async function handleSelectCurrentUserAction(
  args: ActionFunctionArgs,
  formData: FormData
) {
  const { request } = args;
  const userId = String(formData.get("userId"));
  const session = await getSession(request);
  session.set("userId", userId);

  const firstTeamUser = db.teamUsers.findOne({
    userId,
  });

  if (!firstTeamUser) {
    throw new Response(null, {
      status: 400,
      statusText: "User is no associated with any team",
    });
  }

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));

  return redirect(`/${firstTeamUser.teamId}/dashboard`, {
    headers,
  });
}

async function getTeamOrThrow(teamId: string) {
  const team = await getTeam(teamId);
  if (!team) {
    throw new Response(null, {
      status: 404,
      statusText: "Team not found",
    });
  }
  return team;
}

async function handleLogOutAction(args: ActionFunctionArgs) {
  db.users.clear();
  db.teams.clear();
  db.teamUsers.clear();
  db.teamSettings.clear();
  db.teamDailyScrumUpdates.clear();
  db.dailyScrumUpdateQuestions.clear();
  db.dailyScrumUpdateEntries.clear();
  db.dailyScrumUpdateAnswers.clear();

  const { request } = args;
  const session = await getSession(request);
  session.unset("userId");
  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));
  return redirect(`/`, {
    headers,
  });
}

async function populateTeamForAddScrumUpdateModal(team: db.Team) {
  return {
    ...team,
    dailyScrumUpdate: await getTeamDailyScrumUpdate(team.id),
    dailyScrumUpdateQuestions: await getTeamDailyScrumUpdateQuestions(team.id),
  };
}

export async function loader(args: LoaderFunctionArgs) {
  const { request, params } = args;
  const teamId = params.teamId!;
  const session = await getSession(request);
  const user = validateAndGetSessionUser(session);
  validateUserAccessToTeam(teamId, user.id);

  const url = new URL(request.url);
  if (url.pathname === `/${teamId}`) {
    return redirectToDashboard(teamId);
  }

  setLastVisitedTeamIdInSession(session, teamId!);

  const [teams, team, users, teamTimeZone] = await Promise.all([
    getTeams(user.id),
    getTeamOrThrow(teamId),
    getUsers(),
    getTeamTimeZone(teamId),
  ]);

  const headers = new Headers();
  headers.append("Set-Cookie", await sessionStorage.commitSession(session));

  const today = DateTime.now().setZone(getTeamTimeZone(teamId)).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  return json(
    {
      [UI.TEAM_SELECTION]: {
        teams,
        selectedTeam: team,
      },
      [UI.USER_PROFILE]: {
        user,
      },
      [UI.DATA_CONTROL]: {
        users,
        sessionUser: user,
      },
      [UI.ADD_SCRUM_UPDATE_MODAL]: {
        team: await populateTeamForAddScrumUpdateModal(team),
        timeZone: teamTimeZone,
        hasAddedDailyScrumUpdateForToday:
          db.dailyScrumUpdateEntries.where((data) => {
            return (
              data.submittedUserId === user.id &&
              DateTime.fromISO(data.date).hasSame(today, "day")
            );
          }).length > 0,
        hasAddedDailyScrumUpdateForTomorrow:
          db.dailyScrumUpdateEntries.where((data) => {
            return (
              data.submittedUserId === user.id &&
              DateTime.fromISO(data.date).hasSame(tomorrow, "day")
            );
          }).length > 0,
      },
    },
    {
      headers,
    }
  );
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args;

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  formData.delete("_action");

  switch (_action) {
    case ACTIONS[UI.TEAM_SELECTION].SELECT_TEAM: {
      return await handleSelectTeamAction(formData);
    }
    case ACTIONS.SUBMIT_SCRUM_UPDATE: {
      return await handleSubmitScrumUpdateAction(args, formData);
    }
    case ACTIONS[UI.DATA_CONTROL].SELECT_CURRENT_USER: {
      return await handleSelectCurrentUserAction(args, formData);
    }
    case ACTIONS[UI.USER_PROFILE].LOG_OUT: {
      return await handleLogOutAction(args);
    }
  }
}

export default function () {
  const [searchParams] = useSearchParams();

  let isSubmitScrumUpdateDiaglogOpen =
    searchParams.get("dialog") === "add-scrum-update";

  return (
    <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] min-h-screen">
      <Header />
      <Sidebar />
      <main className="col-span-1 row-span-1 bg-white">
        {isSubmitScrumUpdateDiaglogOpen && <SubmitScrumUpdateDialog />}
        <Outlet />
      </main>
    </div>
  );
}

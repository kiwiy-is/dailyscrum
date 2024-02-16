import type { Session } from "@remix-run/node";
import type { SessionData } from "~/sessions";
import { sessionStorage } from "~/sessions";
import * as db from "~/lib/db";

export async function getSession(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  return await sessionStorage.getSession(cookieHeader);
}

function throwForbiddenResponse() {
  throw new Response(null, {
    status: 403,
    statusText: "Forbidden",
  });
}

export function getUser(userId: string) {
  return db.users.findOne({
    id: userId,
  });
}

export function validateAndGetSessionUser(
  session: Session<SessionData, SessionData>
) {
  const userId = session.get("userId");

  if (!userId) {
    throwForbiddenResponse();
  }

  const user = getUser(userId!);

  if (!user) {
    throwForbiddenResponse();
  }

  return user!;
}

export function validateUserAccessToTeam(teamId: string, userId: string) {
  const teamUser = db.teamUsers.findOne({
    teamId,
    userId,
  });

  if (!teamUser) {
    throwForbiddenResponse();
  }
}

export function getTeamTimeZone(teamId: string) {
  const timeZoneSetting = db.teamSettings.findOne({
    teamId,
    attributeKey: "timeZone",
  });

  return timeZoneSetting?.attributeValue ?? "UTC";
}

export async function getDailyScrumUpdateEntry(
  dailyScrumUpdateEntryId: string
) {
  return db.dailyScrumUpdateEntries.findOne({
    id: dailyScrumUpdateEntryId,
  });
}

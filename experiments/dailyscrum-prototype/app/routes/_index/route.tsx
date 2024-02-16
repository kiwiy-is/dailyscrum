import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  Session,
} from "@remix-run/node";
import * as db from "~/lib/db";
import { json, redirect } from "@remix-run/node";
import type { SessionData } from "~/sessions";
import { sessionStorage } from "~/sessions";
import { Link, useFetcher } from "@remix-run/react";
import { Button } from "~/lib/shadcn/ui";
import { Logo } from "~/components/logo/logo";
import * as demoData from "~/lib/demo/utils";
import { useCallback } from "react";
import { demoUser } from "~/lib/demo/utils";
import { getSession, getUser } from "~/lib/route-util";

const ACTIONS = {
  TRY_DEMO: "tryDemo",
} as const;

type ACTIONS = (typeof ACTIONS)[keyof typeof ACTIONS];

function getTeamsForUser(userId: string) {
  const teamUsers = db.teamUsers.find({
    userId,
  });

  const results: (db.Team & LokiObj)[] = [];

  for (const teamUser of teamUsers) {
    const team = db.teams.findOne({
      id: teamUser.teamId,
    });
    if (team) {
      results.push(team);
    }
  }

  return results;
}

function getTeamById(teams: db.Team[], teamId: string) {
  return teams.find((team) => team.id === teamId);
}

function getDefaultTeam(teams: db.Team[]) {
  if (teams.length === 0) {
    throw new Response(null, {
      status: 404,
      statusText: "No team found",
    });
  }
  return teams[0];
}

async function redirectToAppropriateTeam(
  userId: string,
  lastVisitedTeamId: string | undefined
) {
  const teamsForUser = getTeamsForUser(userId);

  const defaultTeam = getDefaultTeam(teamsForUser);

  if (!lastVisitedTeamId) {
    return redirect(`/${defaultTeam.id}`);
  }

  const lastVisitedTeam = getTeamById(teamsForUser, lastVisitedTeamId);

  if (!lastVisitedTeam) {
    return redirect(`/${defaultTeam.id}`);
  }

  return redirect(`/${lastVisitedTeam.id}`);
}

function getDefaultUserId() {
  return demoUser.id;
}

function setDefaultDemoUserIdInSession(
  session: Session<SessionData, SessionData>
) {
  const defaultDemoUserId = getDefaultUserId();
  session.set("userId", defaultDemoUserId);
}

function getDefaultDemoUserDefaultTeam() {
  const defaultDemoUserId = getDefaultUserId();
  const teamsForUser = getTeamsForUser(defaultDemoUserId);
  return getDefaultTeam(teamsForUser);
}

async function handleTryDemoAction(request: Request, formData: FormData) {
  demoData.seedDemoData(String(formData.get("timeZone")));

  const session = await getSession(request);
  const defaultTeam = getDefaultDemoUserDefaultTeam();

  setDefaultDemoUserIdInSession(session);

  const sessionCookieHeader = await sessionStorage.commitSession(session);

  const headers = new Headers();
  headers.append("Set-Cookie", sessionCookieHeader);

  return redirect(`/${defaultTeam.id}`, {
    headers,
  });
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request);

  const userId = session.get("userId");

  if (!userId) {
    return json({});
  }

  const user = getUser(userId);

  if (!user) {
    session.unset("userId");
    const headers = new Headers();
    headers.append("Set-Cookie", await sessionStorage.commitSession(session));
    return json({}, { headers });
  }

  const lastVisitedTeamId = session.get("lastVisitedTeamId");

  return redirectToAppropriateTeam(userId, lastVisitedTeamId);
}

export async function action(args: ActionFunctionArgs) {
  const { request } = args;

  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);
  formData.delete("_action");

  switch (_action) {
    case ACTIONS.TRY_DEMO: {
      return await handleTryDemoAction(request, formData);
    }
  }

  return json({});
}

export default function () {
  const fetcher = useFetcher<typeof action>();

  const handleTryDemoButtonClick = useCallback(() => {
    fetcher.submit(
      {
        _action: ACTIONS.TRY_DEMO,
        timeZone: new Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      { method: "post" }
    );
  }, [fetcher]);

  return (
    <div className="h-screen w-screen flex flex-col ">
      <header>
        <div className="h-14 px-4 flex items-center">
          <div>
            <Link to="/">
              <Logo />
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow flex justify-center items-center">
        <div className="space-y-6 max-w-[752px] text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Your daily scrum facilitator
          </h1>
          <p className="leading-7">
            Streamline your scrums with Daily Scrum Manager!
            <br />
            Efficiently manage daily updates and view team progress in real-time
            on our dashboard.
            <br />
            Note: Available currently in demo mode only.
          </p>
          <Button onClick={handleTryDemoButtonClick}>Try the demo</Button>
        </div>
      </main>
      <footer>
        <div className="h-14 px-4 flex items-center">
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://github.com/kiwiy-is"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              kiwiy-is
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/kiwiy-is/kiwiy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Github
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

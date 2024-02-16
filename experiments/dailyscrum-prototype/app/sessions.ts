import { createCookieSessionStorage } from "@remix-run/node";

export type SessionData = {
  userId: string;
  lastVisitedTeamId: string | undefined;
};

export const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cr3t"],
    secure: process.env.NODE_ENV === "production",
  },
});

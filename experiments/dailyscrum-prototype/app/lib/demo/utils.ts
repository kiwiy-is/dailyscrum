import { nanoid10 } from "../nanoid";
import { DateTime, Interval } from "luxon";
import * as db from "~/lib/db";

const accomplishmentsYesterday = [
  "Reviewed the latest project proposal and met with the engineering heads.",
  "Worked on strategic planning for our product line.",
  "Evaluated supplier practices and conducted a logistics review.",
  "Explored partnerships for our new tech initiatives.",
  "Met with potential investors for our new program.",
  "Reviewed engineering blueprints for the upcoming product.",
  "Evaluated progress on our strategic initiatives.",
];

const plansForToday = [
  "Overseeing the rollout of a new platform and setting up stakeholder meetings.",
  "Meeting with the development team to discuss feature updates.",
  "Focusing on design thinking workshops and preparing for a financial call.",
  "Drafting a keynote speech for a tech conference.",
  "Conducting interviews to promote our new framework.",
  "Test driving a new prototype and hosting a brainstorming session.",
  "Working on the outreach strategy for a new venture.",
];

const potentialBlockers = [
  "Coordination across different time zones.",
  "Integration issues with new software updates.",
  "Global shipping delays.",
  "Technical limitations in current prototypes.",
  "Regulatory hurdles for new ventures.",
  "Need to streamline communication between project teams.",
  "Challenges in scaling our infrastructure to remote areas.",
];

export const demoUser: db.User = {
  id: "3L4adj4TLA",
  name: "All-Rounder User (Default)",
  displayName: "All-Rounder (Default)",
  createdAt: DateTime.utc().toISO(),
};

function generateDemoData(userTimeZone: string) {
  const devSquadTeam = {
    id: nanoid10(),
    name: "Dev Squad",
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
  };

  const qaSquadTeam = {
    id: nanoid10(),
    name: "QA Squad",
    createdAt: DateTime.utc().toISO(),
    updatedAt: DateTime.utc().toISO(),
  };

  const teams: db.Team[] = [devSquadTeam, qaSquadTeam];

  const teamSettings: db.TeamSetting[] = teams.map((team) => ({
    id: nanoid10(),
    teamId: team.id,
    attributeKey: "timeZone",
    attributeValue: userTimeZone,
  }));

  const teamDailyScrumUpdates: db.TeamDailyScrumUpdate[] = teams.map(
    (team) => ({
      id: nanoid10(),
      teamId: team.id,
      description:
        "Answer questions to keep your team updated and work through any challenges together.",
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
    })
  );

  const devTeamUsers: db.User[] = [
    {
      id: nanoid10(),
      name: "Satya Nadella",
      displayName: "Satya",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Sundar Pichai",
      displayName: "Sundar",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Tim Cook",
      displayName: "Tim",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Jensen Huang",
      displayName: "Jensen",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Sam Altman",
      displayName: "Sam",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Elon Musk",
      displayName: "Elon",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Jeff Bezos",
      displayName: "Jeff",
      createdAt: DateTime.utc().toISO(),
    },
  ];

  const qaTeamUsers = [
    {
      id: nanoid10(),
      name: "Bill Gates",
      displayName: "Bill",
      createdAt: DateTime.utc().toISO(),
    },
    {
      id: nanoid10(),
      name: "Mark Zuckerberg",
      displayName: "Mark",
      createdAt: DateTime.utc().toISO(),
    },
  ];

  const users: db.User[] = [demoUser, ...devTeamUsers, ...qaTeamUsers];

  const teamUsers: db.TeamUser[] = [
    {
      teamId: devSquadTeam.id,
      userId: demoUser.id,
      role: "admin",
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
    },
    {
      teamId: qaSquadTeam.id,
      userId: demoUser.id,
      role: "admin",
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
    },
    ...devTeamUsers.map((user) => ({
      teamId: devSquadTeam.id,
      userId: user.id,
      role: "member" as "admin" | "member",
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
    })),
    ...qaTeamUsers.map((user) => ({
      teamId: qaSquadTeam.id,
      userId: user.id,
      role: "member" as "admin" | "member",
      createdAt: DateTime.utc().toISO(),
      updatedAt: DateTime.utc().toISO(),
    })),
  ];

  const dailyScrumUpdateQuestions = teamDailyScrumUpdates.reduce<
    db.DailyScrumUpdateQuestion[]
  >((acc, cv) => {
    return [
      ...acc,
      {
        id: nanoid10(),
        teamDailyScrumUpdateId: cv.id,
        question: "What did I accomplish yesterday?",
        briefQuestion: "Yesterday's Progress",
        placeholder: "Your accomplishments from yesterday",
        description:
          "Describe a brief summary of completed tasks or milestones from yesterday.",
        isRequired: true,
        maxLength: 500,
        order: 0,
        createdAt: DateTime.utc().toISO(),
        updatedAt: DateTime.utc().toISO(),
      },
      {
        id: nanoid10(),
        teamDailyScrumUpdateId: cv.id,
        question: "What will I work on today?",
        briefQuestion: "Today's Plan",
        placeholder: "Today's tasks and goals",
        description: "Describe your planned tasks or objectives for today.",
        isRequired: true,
        maxLength: 500,
        order: 1,
        createdAt: DateTime.utc().toISO(),
        updatedAt: DateTime.utc().toISO(),
      },
      {
        id: nanoid10(),
        teamDailyScrumUpdateId: cv.id,
        question: "Do you have any blockers or impediments?",
        briefQuestion: "Blockers",
        placeholder: "Current blockers or challenges",
        description:
          "Describe any current challenges or obstacles impacting your work.",
        isRequired: true,
        maxLength: 500,
        order: 2,
        createdAt: DateTime.utc().toISO(),
        updatedAt: DateTime.utc().toISO(),
      },
    ];
  }, []);

  const dailyScrumUpdateEntries: db.DailyScrumUpdateEntry[] = [];
  const dailyScrumUpdateAnswers: db.DailyScrumUpdateAnswer[] = [];

  devTeamUsers.forEach((devTeamUser) => {
    const today = DateTime.local().setZone(userTimeZone).startOf("day");
    const tomorrow = today.plus({ days: 1 });

    const intervals = Interval.fromDateTimes(
      today.minus({ months: 12 }).startOf("day"),
      tomorrow
    ).splitBy({ days: 1 });

    intervals
      .map((interval) => interval.start!)
      // .filter((date) => date.weekday >= 1 && date.weekday <= 5)
      .forEach((date) => {
        const entry = {
          id: nanoid10(),
          teamDailyScrumUpdateId: teamDailyScrumUpdates.find(
            (teamDailyScrumUpdate) =>
              teamDailyScrumUpdate.teamId === devSquadTeam.id
          )!.id,
          submittedUserId: devTeamUser.id,
          date: date.toISODate(),
          timeZone: userTimeZone,
          createdAt: DateTime.utc().toISO(),
          updatedAt: DateTime.utc().toISO(),
        };

        const answers = [
          {
            id: nanoid10(),
            dailyScrumUpdateEntryId: entry.id,
            dailyScrumUpdateQuestionId: dailyScrumUpdateQuestions[0].id,
            answer:
              accomplishmentsYesterday[
                Math.floor(Math.random() * accomplishmentsYesterday.length)
              ],
            createdAt: DateTime.utc().toISO(),
            updatedAt: DateTime.utc().toISO(),
          },
          {
            id: nanoid10(),
            dailyScrumUpdateEntryId: entry.id,
            dailyScrumUpdateQuestionId: dailyScrumUpdateQuestions[1].id,
            answer:
              plansForToday[Math.floor(Math.random() * plansForToday.length)],
            createdAt: DateTime.utc().toISO(),
            updatedAt: DateTime.utc().toISO(),
          },
          {
            id: nanoid10(),
            dailyScrumUpdateEntryId: entry.id,
            dailyScrumUpdateQuestionId: dailyScrumUpdateQuestions[2].id,
            answer:
              potentialBlockers[
                Math.floor(Math.random() * potentialBlockers.length)
              ],
            createdAt: DateTime.utc().toISO(),
            updatedAt: DateTime.utc().toISO(),
          },
        ];

        dailyScrumUpdateEntries.push(entry);
        dailyScrumUpdateAnswers.push(...answers);
      });
  });

  return {
    teams,
    teamUsers,
    teamSettings,
    teamDailyScrumUpdates,
    users,
    dailyScrumUpdateQuestions,
    dailyScrumUpdateEntries,
    dailyScrumUpdateAnswers,
  };
}

export function seedDemoData(userTimeZone: string) {
  db.users.clear();
  db.teams.clear();
  db.teamUsers.clear();
  db.teamSettings.clear();
  db.teamDailyScrumUpdates.clear();
  db.dailyScrumUpdateQuestions.clear();
  db.dailyScrumUpdateEntries.clear();
  db.dailyScrumUpdateAnswers.clear();

  const demoData = generateDemoData(userTimeZone);

  db.users.insert(demoData.users);
  db.teams.insert(demoData.teams);
  db.teamUsers.insert(demoData.teamUsers);
  db.teamSettings.insert(demoData.teamSettings);
  db.teamDailyScrumUpdates.insert(demoData.teamDailyScrumUpdates);
  db.dailyScrumUpdateQuestions.insert(demoData.dailyScrumUpdateQuestions);
  db.dailyScrumUpdateEntries.insert(demoData.dailyScrumUpdateEntries);
  db.dailyScrumUpdateAnswers.insert(demoData.dailyScrumUpdateAnswers);
}

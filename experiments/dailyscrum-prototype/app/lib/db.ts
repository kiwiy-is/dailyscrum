import loki from "lokijs";

export type User = {
  id: string;
  name: string;
  displayName: string;
  createdAt: string;
};

export type Team = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamSetting = {
  id: string;
  teamId: string; // FK to Team
  attributeKey: string;
  attributeValue: string;
};

export type TeamDailyScrumUpdate = {
  id: string;
  teamId: string; // FK to Team
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TeamUser = {
  teamId: string; // FK to Team
  userId: string; // FK to User
  role: "admin" | "member";
  createdAt: string;
  updatedAt: string;
};

export type DailyScrumUpdateQuestion = {
  id: string;
  teamDailyScrumUpdateId: string; // FK to TeamDailyScrumUpdate
  question: string;
  briefQuestion: string;
  // type: string; // e.g., 'text', 'textarea', 'select'
  placeholder: string;
  description: string;
  isRequired: boolean;
  maxLength?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

// Optional: Represents predefined options for a multiple-choice question
export type ScrumUpdateQuestionOption = {
  id: string;
  dailyScrumUpdateQuestionId: string; // FK to ScrumUpdateQuestion
  optionValue: string;
  displayText: string;
  order: number;
};

export type DailyScrumUpdateEntry = {
  id: string;
  teamDailyScrumUpdateId: string; // FK to TeamDailyScrumUpdate
  submittedUserId: string; // FK to User
  date: string;
  timeZone: string;
  createdAt: string;
  updatedAt: string;
};

export type DailyScrumUpdateAnswer = {
  id: string;
  dailyScrumUpdateEntryId: string; // FK to ScrumUpdateEntry
  dailyScrumUpdateQuestionId: string; // FK to ScrumUpdateQuestion
  answer: string;
  createdAt: string;
  updatedAt: string;
};

export const db = new loki("loki.db", {
  autoload: true,
  autoloadCallback: handleAutoload,
  autosave: true,
  autosaveInterval: 4000,
});

export let users = db.addCollection<User>("users");
export let teams = db.addCollection<Team>("teams");
export let teamUsers = db.addCollection<TeamUser>("teamUsers");
export let teamSettings = db.addCollection<TeamSetting>("teamSettings");
export let teamDailyScrumUpdates = db.addCollection<TeamDailyScrumUpdate>(
  "teamDailyScrumUpdates"
);
export let dailyScrumUpdateQuestions =
  db.addCollection<DailyScrumUpdateQuestion>("dailyScrumUpdateQuestions");
export let dailyScrumUpdateEntries = db.addCollection<DailyScrumUpdateEntry>(
  "dailyScrumUpdateEntries"
);
export let dailyScrumUpdateAnswers = db.addCollection<DailyScrumUpdateAnswer>(
  "dailyScrumUpdateAnswers"
);

function handleAutoload() {
  console.log("===============================");
  console.log("handleAutoload called");
  console.log("===============================");

  const retrievedUsers = db.getCollection("users");
  if (retrievedUsers === null) {
    users = db.addCollection<User>("users");
  } else if (retrievedUsers.count() !== users.count()) {
    users = retrievedUsers;
  }

  const retrievedTeams = db.getCollection("teams");
  if (retrievedTeams === null) {
    teams = db.addCollection<Team>("teams");
  } else if (retrievedTeams.count() !== teams.count()) {
    teams = retrievedTeams;
  }

  const retrievedTeamUsers = db.getCollection("teamUsers");
  if (retrievedTeamUsers === null) {
    teamUsers = db.addCollection<TeamUser>("teamUsers");
  } else if (retrievedTeamUsers.count() !== teamUsers.count()) {
    teamUsers = retrievedTeamUsers;
  }

  const retrievedTeamSettings = db.getCollection("teamSettings");
  if (retrievedTeamSettings === null) {
    teamSettings = db.addCollection<TeamSetting>("teamSettings");
  } else if (retrievedTeamSettings.count() !== teamSettings.count()) {
    teamSettings = retrievedTeamSettings;
  }

  const retrievedTeamDailyScrumUpdates = db.getCollection(
    "teamDailyScrumUpdates"
  );
  if (retrievedTeamDailyScrumUpdates === null) {
    teamDailyScrumUpdates = db.addCollection<TeamDailyScrumUpdate>(
      "teamDailyScrumUpdates"
    );
  } else if (
    retrievedTeamDailyScrumUpdates.count() !== teamDailyScrumUpdates.count()
  ) {
    teamDailyScrumUpdates = retrievedTeamDailyScrumUpdates;
  }

  const retrievedDailyScrumUpdateQuestions = db.getCollection(
    "dailyScrumUpdateQuestions"
  );
  if (retrievedDailyScrumUpdateQuestions === null) {
    dailyScrumUpdateQuestions = db.addCollection<DailyScrumUpdateQuestion>(
      "dailyScrumUpdateQuestions"
    );
  } else if (
    retrievedDailyScrumUpdateQuestions.count() !==
    dailyScrumUpdateQuestions.count()
  ) {
    dailyScrumUpdateQuestions = retrievedDailyScrumUpdateQuestions;
  }

  const retrievedDailyScrumUpdateEntries = db.getCollection(
    "dailyScrumUpdateEntries"
  );
  if (retrievedDailyScrumUpdateEntries === null) {
    dailyScrumUpdateEntries = db.addCollection<DailyScrumUpdateEntry>(
      "dailyScrumUpdateEntries"
    );
  } else if (
    retrievedDailyScrumUpdateEntries.count() !== dailyScrumUpdateEntries.count()
  ) {
    dailyScrumUpdateEntries = retrievedDailyScrumUpdateEntries;
  }

  const retrievedDailyScrumUpdateAnswers = db.getCollection(
    "dailyScrumUpdateAnswers"
  );
  if (retrievedDailyScrumUpdateAnswers === null) {
    dailyScrumUpdateAnswers = db.addCollection<DailyScrumUpdateAnswer>(
      "dailyScrumUpdateAnswers"
    );
  } else if (
    retrievedDailyScrumUpdateAnswers.count() !== dailyScrumUpdateAnswers.count()
  ) {
    dailyScrumUpdateAnswers = retrievedDailyScrumUpdateAnswers;
  }

  // total count of every collection
  console.log("users count : " + users.count());
  console.log("teams count : " + teams.count());
  console.log("teamUsers count : " + teamUsers.count());
  console.log("teamSettings count : " + teamSettings.count());
  console.log("teamDailyScrumUpdates count : " + teamDailyScrumUpdates.count());
  console.log(
    "dailyScrumUpdateQuestions count : " + dailyScrumUpdateQuestions.count()
  );
  console.log(
    "dailyScrumUpdateEntries count : " + dailyScrumUpdateEntries.count()
  );
  console.log(
    "dailyScrumUpdateAnswers count : " + dailyScrumUpdateAnswers.count()
  );
}

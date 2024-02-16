import NodeCache from "node-cache";

declare global {
  // var __cache: NodeCache | undefined;
  var __cache: NodeCache;
}

if (!global.__cache) {
  global.__cache = new NodeCache();
  console.log("cache is created on global!");

  global.__cache.on("set", (key) => {
    console.log(`key ${key} is set!`);
  });
  global.__cache.on("del", (key) => {
    console.log(`key ${key} is deleted!`);
  });
}

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

class CacheableArray<T> extends Array<T> {
  constructor(
    private cacheKey: string,
    ...items: T[]
  ) {
    const cachedValue = global.__cache.get<T[]>(cacheKey);
    if (cachedValue) {
      super(...cachedValue);
    } else {
      super(...items);
    }
  }

  push(...elements: T[]): number {
    const result = super.push(...elements);
    global.__cache.set(this.cacheKey, this);
    return result;
  }
}

/************
 *
 * TODO:
 *
 * ABORT!!!!
 * USE LOCALSTORAGE INSTEAD!!!!
 * REFACTOR WHOLE APP!!!
 *
 */

export const users = new CacheableArray<User>("users");
export const teams = new CacheableArray<Team>("teams");
export const teamSettings = new CacheableArray<TeamSetting>("teamSettings");
export const teamUsers = new CacheableArray<TeamUser>("teamUsers");
export const teamDailyScrumUpdates = new CacheableArray<TeamDailyScrumUpdate>(
  "teamDailyScrumUpdates"
);
export const dailyScrumUpdateQuestions =
  new CacheableArray<DailyScrumUpdateQuestion>("dailyScrumUpdateQuestions");
export const dailyScrumUpdateEntries =
  new CacheableArray<DailyScrumUpdateEntry>("dailyScrumUpdateEntries");
export const dailyScrumUpdateAnswers =
  new CacheableArray<DailyScrumUpdateAnswer>("dailyScrumUpdateAnswers");

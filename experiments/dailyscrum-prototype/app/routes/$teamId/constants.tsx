export const UI = {
  TEAM_SELECTION: "teamSelection",
  USER_PROFILE: "userProfile",
  DATA_CONTROL: "dataControl",
  ADD_SCRUM_UPDATE_MODAL: "addScrumUpdateModal",
} as const;

export const ACTIONS = {
  SUBMIT_SCRUM_UPDATE: "submitScrupUpdate",
  [UI.TEAM_SELECTION]: {
    SELECT_TEAM: `${UI.TEAM_SELECTION}/selectTeam`,
  },
  [UI.DATA_CONTROL]: {
    SELECT_CURRENT_USER: `${UI.DATA_CONTROL}/selectCurrentUser`,
  },
  [UI.USER_PROFILE]: {
    LOG_OUT: `${UI.USER_PROFILE}/logOut`,
  },
} as const;

export type ACTIONS = (typeof ACTIONS)[keyof typeof ACTIONS];

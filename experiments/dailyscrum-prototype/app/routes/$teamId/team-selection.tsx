import React from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { loader } from "./route";
import { ACTIONS, UI } from "./constants";
import TeamSelectionCombobox from "~/components/team-selection-combobox/team-selection-combobox";

export default function TeamSelection() {
  const {
    teamSelection: { teams, selectedTeam },
  } = useLoaderData<typeof loader>();

  const fetcher = useFetcher();

  const handleTeamSelect = React.useCallback(
    (teamId: string) => {
      fetcher.submit(
        {
          _action: ACTIONS[UI.TEAM_SELECTION].SELECT_TEAM,
          teamId,
        },
        {
          method: "POST",
        }
      );
    },
    [fetcher]
  );

  return (
    <TeamSelectionCombobox
      teams={teams}
      selectedTeam={selectedTeam}
      onTeamSelect={handleTeamSelect}
    />
  );
}

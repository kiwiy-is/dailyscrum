import TeamSelectionUI from "@/components/team-selection";
import { redirect } from "next/navigation";
import { getParams } from "next-impl-getters/get-params";

const TEMP_TEAMS = [
  { id: "a", name: "Team A" },
  { id: "b", name: "Team B" },
];

async function selectTeam(teamId: string) {
  "use server";
  redirect(`/teams/${teamId}/dashboard`);
}

type Props = {
  children?: React.ReactNode;
};

const TeamSelection: React.FC<Props> = (props) => {
  const { teamId } = getParams() as { teamId: string };

  return (
    <TeamSelectionUI
      teams={TEMP_TEAMS}
      selectedTeam={
        TEMP_TEAMS.find((team) => team.id === teamId) ?? TEMP_TEAMS[0]
      }
      onTeamSelect={selectTeam}
    />
  );
};

export default TeamSelection;

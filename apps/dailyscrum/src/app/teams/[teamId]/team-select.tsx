"use client";

import { useParams, useRouter } from "next/navigation";

type Props = {
  children?: React.ReactNode;
};

const TeamSelect: React.FC<Props> = (props) => {
  const router = useRouter();
  const { teamId } = useParams<{ teamId: string }>();

  return (
    <select
      onChange={(event) => {
        router.push(`/teams/${event.target.value}`);
      }}
      value={teamId}
    >
      <option value={"a"}>Team A</option>
      <option value={"b"}>Team B</option>
    </select>
  );
};

export default TeamSelect;

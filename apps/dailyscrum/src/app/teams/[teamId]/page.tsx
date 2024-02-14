export default async function Page({
  params: { teamId },
}: {
  params: { teamId: string };
}) {
  return (
    <div>
      <h1>Team {teamId}</h1>
    </div>
  );
}

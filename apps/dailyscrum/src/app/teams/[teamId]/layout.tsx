import Link from "next/link";
import TeamSelection from "./team-selection";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { teamId: string };
}) {
  return (
    <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] min-h-screen">
      <header className="border-b col-span-2 row-span-1">
        <div className="h-14 px-4 flex justify-between">Header</div>
      </header>
      <aside className="border-r col-span-1 row-span-1">
        <div className="w-[272px] px-4 py-6 flex flex-col gap-y-6">
          <TeamSelection />
          <Link
            href="/teams/[teamId]/dashboard"
            as={`/teams/${params.teamId}/dashboard`}
          >
            Dashboard
          </Link>
          <Link
            href="/teams/[teamId]/settings"
            as={`/teams/${params.teamId}/settings`}
          >
            Settings
          </Link>
        </div>
      </aside>
      <main className="col-span-1 row-span-1 bg-white ">
        <div className="py-6 px-6 flex flex-col gap-y-6">{children}</div>
      </main>
    </div>
  );
}

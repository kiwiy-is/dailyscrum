import TeamSelection from "./team-selection";
import AddUpdateButton from "./add-update-button";
import Navigation from "./navigation";

export default function Sidebar() {
  return (
    <aside className="border-r col-span-1 row-span-1 ">
      <div className="w-[272px] px-4 py-6 flex flex-col gap-y-6">
        <div>
          <TeamSelection />
        </div>
        <div>
          <AddUpdateButton />
        </div>
        <Navigation />
      </div>
    </aside>
  );
}

import NavLink from "@/components/nav-link";
import { LayoutDashboardIcon, Settings2Icon } from "lucide-react";
import React from "react";
import { cn } from "ui";
import { buttonVariants } from "ui/button";
import MyUpdatesLink from "./my-updates-link";
import UserMenu from "./user-menu";
import WorkspaceSelectionLoader from "./workspace-selection-loader";
import KiwiyDailyScrumLogo from "./kiwiy-daily-scrum-logo";

type Props = {
  workspaceHashId: string;
};

const Sidebar = ({ workspaceHashId }: Props) => {
  return (
    <aside className="h-full">
      <div className="h-full flex flex-col flex-1 px-4 pt-6 pb-4">
        <div className="items-center h-9 ml-4 hidden md:!flex">
          <KiwiyDailyScrumLogo workspaceHashId={workspaceHashId} />
        </div>

        <div className="space-y-6 flex-1 mt-6">
          <div>
            {/* TODO: render on page instead of layout */}
            <WorkspaceSelectionLoader workspaceHashId={workspaceHashId} />
          </div>

          <nav className="flex flex-col flex-1 space-y-1">
            <NavLink
              href={`/app/workspaces/${workspaceHashId}/board`}
              activeClassName="bg-accent"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "justify-start gap-x-2"
              )}
            >
              <LayoutDashboardIcon width={16} height={16} strokeWidth={2} />
              <span>Board</span>
            </NavLink>

            <MyUpdatesLink />

            <NavLink
              href={`/app/workspaces/${workspaceHashId}/settings`}
              activeClassName="bg-accent"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                }),
                "justify-start gap-x-2"
              )}
            >
              <Settings2Icon width={16} height={16} strokeWidth={2} />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>

        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;

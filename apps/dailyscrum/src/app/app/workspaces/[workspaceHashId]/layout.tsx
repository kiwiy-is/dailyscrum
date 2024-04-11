import OrganizationSelectionLoader from "./organization-selection-loader";
import React from "react";
import CreateNewOrganizationDialog from "./create-new-organization-dialog";
import { Button, buttonVariants } from "ui/button";
import { cn } from "ui";
import NavLink from "@/components/nav-link";
import MyUpdatesLink from "./my-updates-link";
import { LayoutDashboardIcon, Settings2Icon } from "lucide-react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import UserMenu from "./user-menu";
import AddScrumUpdateDialogLoader from "./add-scrum-update-dialog-loader";
import { ScrollArea } from "ui/shadcn-ui/scroll-area";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceHashId: string };
}) {
  return (
    <>
      <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] min-h-screen h-screen">
        <aside className="border-r col-span-1 row-span-2">
          <div className="w-[224px] h-full flex flex-col flex-1 px-4 pt-6 pb-4 space-y-6">
            <div className="flex items-center gap-1.5 h-8">
              <KiwiyIsSymbol width={24} height={24} />
              <span className="text-base font-bold">Daily Scrum</span>
            </div>

            <div className="">
              <OrganizationSelectionLoader />
            </div>

            <nav className="flex flex-col flex-1 space-y-1">
              <NavLink
                href={`/app/workspaces/${params.workspaceHashId}/board`}
                activeClassName="bg-accent"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "justify-start gap-x-2"
                )}
              >
                <LayoutDashboardIcon width={16} height={16} strokeWidth={2} />
                <span>Board</span>
              </NavLink>

              <MyUpdatesLink />

              <NavLink
                href={`/app/workspaces/${params.workspaceHashId}/settings`}
                activeClassName="bg-accent"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "justify-start gap-x-2"
                )}
              >
                <Settings2Icon width={16} height={16} strokeWidth={2} />
                <span>Settings</span>
              </NavLink>
            </nav>

            <UserMenu />
          </div>
        </aside>
        <header className=" border-b">
          <div className="h-[40px] px-4 flex justify-end items-center ">
            <Button variant="outline" size="sm" className="text-xs h-7 px-2.5">
              Feedback
            </Button>
          </div>
        </header>
        <ScrollArea>
          <main className="py-8 px-8">{children}</main>
        </ScrollArea>
      </div>
      <CreateNewOrganizationDialog />
      <AddScrumUpdateDialogLoader />
    </>
  );
}

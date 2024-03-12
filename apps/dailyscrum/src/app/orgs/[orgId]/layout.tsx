import OrganizationSelectionLoader from "./organization-selection-loader";
import React from "react";
import CreateNewOrganizationDialog from "./create-new-organization-dialog";
import { Button, buttonVariants } from "ui/button";
import { cn } from "ui";
import NavLink from "@/components/nav-link";
import MyPageLink from "./my-page-link";
import { LayoutDashboardIcon, PlusIcon, Settings2Icon } from "lucide-react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import UserMenu from "./user-menu";
import AddScrumUpdateDialogLoader from "./add-scrum-update-dialog-loader";
import AddUpdateButton from "./add-update-button";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  return (
    <>
      <div className="grid grid-rows-[auto,1fr] grid-cols-[auto,1fr] min-h-screen">
        <header className="border-b col-span-2 row-span-1">
          <div className="h-12 px-4 flex justify-between">
            <div className="flex items-center gap-2">
              <KiwiyIsSymbol width={26} height={26} />
              <span className="text-base font-bold">dailyscrum</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2.5"
              >
                Feedback
              </Button>
            </div>
          </div>
        </header>
        <aside className="border-r col-span-1 row-span-1">
          <div className="w-[272px] px-4 pt-6 pb-4 flex flex-col justify-between h-full">
            <div className=" flex flex-col gap-y-6">
              {/* TODO: Maybe rename it to organization-selection-combobox? */}
              <OrganizationSelectionLoader />

              <div className="flex flex-col gap-y-1">
                <AddUpdateButton />
              </div>

              <nav className="flex flex-col gap-y-1">
                <NavLink
                  href={`/orgs/${params.orgId}/dashboard`}
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
                  <span>Dashboard</span>
                </NavLink>

                <MyPageLink />

                <NavLink
                  href={`/orgs/${params.orgId}/settings`}
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
            </div>

            <nav className="flex flex-col gap-y-1">
              <UserMenu />
            </nav>
          </div>
        </aside>
        <main className="col-span-1 row-span-1 bg-white ">
          <div className="py-6 px-6 flex flex-col gap-y-6">{children}</div>
        </main>
      </div>
      <CreateNewOrganizationDialog />
      <AddScrumUpdateDialogLoader />
    </>
  );
}

import OrganizationSelection from "./organization-selection-loader";
import React from "react";
import CreateNewOrganizationDialog from "./create-new-organization-dialog";
import { Button, buttonVariants } from "ui/button";
import { cn } from "ui";
import NavLink from "@/components/nav-link";
import MyPageLink from "./my-page-link";

export default function Layout({
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
          <div className="h-14 px-4 flex justify-between">Header</div>
        </header>
        <aside className="border-r col-span-1 row-span-1">
          <div className="w-[272px] px-4 py-6 flex flex-col gap-y-6">
            <OrganizationSelection />

            <div>
              <Button />
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
                  "justify-start"
                )}
              >
                Dashboard
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
                  "justify-start"
                )}
              >
                Settings
              </NavLink>
            </nav>
          </div>
        </aside>
        <main className="col-span-1 row-span-1 bg-white ">
          <div className="py-6 px-6 flex flex-col gap-y-6">{children}</div>
        </main>
      </div>
      <CreateNewOrganizationDialog />
    </>
  );
}

import React from "react";
import CreateNewWorkspaceDialog from "./create-new-workspace-dialog";
import AddScrumUpdateDialogLoader from "./add-scrum-update-dialog-loader";
import ResizableLayout from "./resizable-layout";
import { cookies } from "next/headers";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "./constants";

import SidebarSheetOpener from "./sidebar-sheet-opener";
import Sidebar from "./sidebar";
import KiwiyDailyScrumLogo from "./kiwiy-daily-scrum-logo";
import AccountSettingsDialogLoader from "./account-settings-dialog-loader";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceHashId: string };
}) {
  const layoutCookieValue = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);

  const defaultLayout = layoutCookieValue
    ? JSON.parse(layoutCookieValue.value)
    : undefined;

  // TODO: viewport style is not overriding. Had to put ! on every style. Fix it.
  return (
    <>
      {/* From md: 768px ~ */}
      <div className="hidden md:!block">
        <ResizableLayout
          defaultLayout={defaultLayout}
          sidebarPanelContent={
            <Sidebar workspaceHashId={params.workspaceHashId} />
          }
          contentPanelContent={
            <div className="h-screen min-h-screen overflow-auto relative">
              {/* TODO: Is scroll area really necessary? Check on MS windows */}
              {/* <ScrollArea>
               </ScrollArea> */}
              <main className="py-6 px-8">{children}</main>
            </div>
          }
        />
      </div>

      {/* Until md: 0px ~ 767px */}
      <div className="block md:!hidden">
        <header className="fixed left-0 right-0 top-0 border-b bg-white z-10">
          <div className="h-[56px] flex items-center justify-between px-4">
            <KiwiyDailyScrumLogo workspaceHashId={params.workspaceHashId} />
            <SidebarSheetOpener
              sheetContent={
                <Sidebar workspaceHashId={params.workspaceHashId} />
              }
            />
          </div>
        </header>
        <main className="py-6 px-4 mt-[56px]">{children}</main>
      </div>

      <CreateNewWorkspaceDialog />
      <AddScrumUpdateDialogLoader workspaceHashId={params.workspaceHashId} />
      <AccountSettingsDialogLoader />
    </>
  );
}

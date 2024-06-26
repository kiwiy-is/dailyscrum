import React from "react";
import CreateNewWorkspaceDialog from "./create-new-workspace-dialog";
import { cookies } from "next/headers";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "./constants";

import SidebarSheetOpener from "./sidebar-sheet-opener";
import Sidebar from "./sidebar";
import KiwiyDailyScrumLogo from "./kiwiy-daily-scrum-logo";
import AccountSettingsDialogLoader from "./account-settings-dialog-loader";
import dynamic from "next/dynamic";

const ResizableLayout = dynamic(() => import("./resizable-layout"), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
  params: { workspaceHashId: string };
};

const Layout = async ({ children, params }: Props) => {
  const layoutCookieValue = cookies().get(RESIZABLE_LAYOUT_COOKIE_KEY);

  const defaultLayout = layoutCookieValue
    ? JSON.parse(layoutCookieValue.value)
    : undefined;

  // TODO: viewport style is not overriding. Had to put ! on every style. Fix it.
  return (
    <>
      <ResizableLayout
        defaultLayout={defaultLayout}
        sidebarPanelContent={
          <Sidebar workspaceHashId={params.workspaceHashId} />
        }
        contentPanelContent={
          <>
            <header className="fixed left-0 right-0 top-0 border-b bg-white z-10 md:!hidden">
              <div className="h-[56px] flex items-center justify-between px-4">
                <KiwiyDailyScrumLogo workspaceHashId={params.workspaceHashId} />
                <SidebarSheetOpener
                  sheetContent={
                    <Sidebar workspaceHashId={params.workspaceHashId} />
                  }
                />
              </div>
            </header>
            <main className=" py-6 px-4 mt-[56px] md:!px-8 md:!mt-0">
              {children}
            </main>
          </>
        }
      />

      {/* TODO: Move dialogs into page. Use parallel routes if needed */}
      <CreateNewWorkspaceDialog />
      <AccountSettingsDialogLoader />
    </>
  );
};

export default Layout;

"use client";

import React, { useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";
import {
  ImperativePanelGroupHandle,
  ImperativePanelHandle,
  PanelGroupOnLayout,
} from "react-resizable-panels";
import { RESIZABLE_LAYOUT_COOKIE_KEY } from "./constants";

const PANEL_GROUP_ID = "resizable-layout-panel-group";

const SIDEBAR_PANEL_MIN_SIZE = 224; // in pixel
const SIDEBAR_PANEL_MAX_SIZE = 344; // in pixel
const SIDEBAR_PANEL_MEDIAN_SIZE =
  (SIDEBAR_PANEL_MIN_SIZE + SIDEBAR_PANEL_MAX_SIZE) / 2; // 284px

const adjustLayout = (layout: number[]) => {
  const [sidebarPanelPercent] = layout;
  const sidebarPanelSize = (window.innerWidth * sidebarPanelPercent) / 100;

  let newSidebarPanelPercent = sidebarPanelPercent;

  if (sidebarPanelSize < SIDEBAR_PANEL_MIN_SIZE) {
    newSidebarPanelPercent = (SIDEBAR_PANEL_MIN_SIZE / window.innerWidth) * 100;
  } else if (sidebarPanelSize > SIDEBAR_PANEL_MAX_SIZE) {
    newSidebarPanelPercent = (SIDEBAR_PANEL_MAX_SIZE / window.innerWidth) * 100;
  }

  const newContentPanelPercent = 100 - newSidebarPanelPercent;

  return [newSidebarPanelPercent, newContentPanelPercent];
};

const saveLayoutToCookie = (layout: number[]): void => {
  const layoutCookieValue = JSON.stringify(layout);
  document.cookie = `${RESIZABLE_LAYOUT_COOKIE_KEY}=${layoutCookieValue}`;
};

type Props = {
  sidebarPanelContent: React.ReactNode;
  contentPanelContent: React.ReactNode;
  defaultLayout?: number[];
};

const ResizableLayout = ({
  defaultLayout,
  sidebarPanelContent,
  contentPanelContent,
}: Props) => {
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  const sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  const sidebarPanelDefaultWidth = defaultLayout
    ? defaultLayout[0]
    : (SIDEBAR_PANEL_MIN_SIZE / window.innerWidth) * 100;
  const contentPanelDefaultWidth = 100 - sidebarPanelDefaultWidth;

  const updateLayoutAndSaveToCookie = (layout: number[]) => {
    const newLayout = adjustLayout(layout);
    panelGroupRef.current?.setLayout(newLayout);
    saveLayoutToCookie(newLayout);
  };

  useEffect(() => {
    const handler = () => {
      const layout = panelGroupRef.current?.getLayout();

      if (!layout) return;

      updateLayoutAndSaveToCookie(layout);
    };

    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  const handleLayout: PanelGroupOnLayout = (layout) => {
    updateLayoutAndSaveToCookie(layout);
  };

  return (
    <ResizablePanelGroup
      ref={panelGroupRef}
      direction="horizontal"
      id={PANEL_GROUP_ID}
      onLayout={handleLayout}
      className="md:!h-screen"
    >
      <ResizablePanel
        id="sidebar-panel"
        ref={sidebarPanelRef}
        defaultSize={sidebarPanelDefaultWidth}
        className="hidden md:!block"
      >
        {sidebarPanelContent}
      </ResizablePanel>
      <ResizableHandle className="hidden md:!block" />
      <ResizablePanel
        defaultSize={contentPanelDefaultWidth}
        className="md:!overflow-y-auto"
      >
        {contentPanelContent}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ResizableLayout;

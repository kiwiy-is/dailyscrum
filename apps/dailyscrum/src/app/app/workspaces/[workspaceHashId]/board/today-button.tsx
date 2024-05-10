import { getWorkspaceSettings } from "@/services/workspace-settings";
import { getWorkspaceByHashId } from "@/services/workspaces";
import {
  ArrowDownToDotIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "lucide-react";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";
import { cn } from "ui";
import { buttonVariants } from "ui/button";

type Props = {
  workspaceHashId: string;
  dateQuery: string | undefined;
};

const TodayButton = async ({ workspaceHashId, dateQuery }: Props) => {
  const { data: workspace, error: getWorkspaceError } =
    await getWorkspaceByHashId(workspaceHashId);

  if (getWorkspaceError || !workspace) {
    return null;
  }

  const { data: settings, error: getSettingsError } =
    await getWorkspaceSettings(workspace.id);

  if (getSettingsError || !settings) {
    return null;
  }

  const timeZone = settings.find(
    (setting) => setting.attribute_key === "time_zone"
  )?.attribute_value;

  if (!timeZone) {
    return null;
  }

  const today = DateTime.now().setZone(timeZone).startOf("day");

  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
      : today;

  const diffDays = date.diff(today, "day").days;

  const isToday = diffDays === 0;
  const isBeforeToday = diffDays < 0;
  const isAfterToday = diffDays > 0;

  return (
    <Link
      href={`/app/workspaces/${workspaceHashId}/board?date=${today.toISODate()}`}
      className={cn(buttonVariants({ variant: "outline" }), "gap-x-2 text-sm")}
      replace
    >
      {isToday && <ArrowDownToDotIcon size={16} />}
      {isBeforeToday && <ArrowRightIcon size={16} />}
      {isAfterToday && <ArrowLeftIcon size={16} />}
      <span>Today</span>
    </Link>
  );
};

export default TodayButton;

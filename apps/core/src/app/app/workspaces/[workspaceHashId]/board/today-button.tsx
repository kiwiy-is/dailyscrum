"use client";

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
import { useParams, useSearchParams } from "next/navigation";
import { Skeleton } from "ui/shadcn-ui/skeleton";

type Props = {
  timeZone: string;
};

const TodayButton = ({ timeZone }: Props) => {
  const searchParams = useSearchParams();
  const { workspaceHashId } = useParams<{ workspaceHashId: string }>();

  const dateQuery = searchParams.get("date");

  const today = DateTime.local({ zone: timeZone }).startOf("day");

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
    >
      {isToday && <ArrowDownToDotIcon size={16} />}
      {isBeforeToday && <ArrowRightIcon size={16} />}
      {isAfterToday && <ArrowLeftIcon size={16} />}
      <span>Today</span>
    </Link>
  );
};

export const TodayButtonSkeleton = () => {
  return <Skeleton className="w-[98px] h-[40px] rounded-md" />;
};

export default TodayButton;

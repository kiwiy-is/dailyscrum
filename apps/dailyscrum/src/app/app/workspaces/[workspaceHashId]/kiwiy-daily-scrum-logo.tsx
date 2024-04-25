import Link from "next/link";
import React from "react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";

type Props = {
  workspaceHashId: string;
};

const KiwiyDailyScrumLogo = ({ workspaceHashId }: Props) => {
  return (
    <Link
      href={`/app/workspaces/${workspaceHashId}/board`}
      className="inline-flex gap-1.5 items-center"
    >
      <KiwiyIsSymbol width={24} height={24} fill="currentColor" />
      <span className="text-md leading-none tracking-tight font-bold">
        Daily Scrum
      </span>
    </Link>
  );
};

export default KiwiyDailyScrumLogo;

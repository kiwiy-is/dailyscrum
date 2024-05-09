import Link from "next/link";
import React from "react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";
import { Badge } from "ui/shadcn-ui/badge";

type Props = {
  workspaceHashId: string;
};

const KiwiyDailyScrumLogo = ({ workspaceHashId }: Props) => {
  return (
    <div className="flex gap-x-2">
      <Link
        href={`/app/workspaces/${workspaceHashId}/board`}
        className="inline-flex gap-1.5 items-center"
      >
        <KiwiyIsSymbol width={24} height={24} fill="currentColor" />
        <span className="text-md leading-none tracking-tight font-bold">
          Daily Scrum
        </span>
      </Link>
      <Badge variant="secondary">Beta</Badge>
    </div>
  );
};

export default KiwiyDailyScrumLogo;

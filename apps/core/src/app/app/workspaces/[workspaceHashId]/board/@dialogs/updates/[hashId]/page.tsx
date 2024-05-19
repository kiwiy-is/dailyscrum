import React, { Suspense } from "react";
import EditUpdateDialog from "./edit-update-dialog";
import EditUpdateDialogContentLoader from "./edit-update-dialog-content-loader";
import sqids from "@/lib/sqids";
import PageFlowHandler from "./page-flow-handler";

type Props = {
  params: {
    workspaceHashId: string;
    hashId: string;
  };
  searchParams: {
    date?: string;
  };
};

const Page = ({ params: { workspaceHashId, hashId }, searchParams }: Props) => {
  const id = sqids.decode(hashId);
  const updateEntryId: number | undefined = id[0];

  if (!updateEntryId) {
    return null;
  }

  return (
    <>
      <Suspense>
        <PageFlowHandler hashId={hashId} />
      </Suspense>
      <EditUpdateDialog
        content={
          // TODO: work on suspense fallback
          <Suspense fallback={null}>
            <EditUpdateDialogContentLoader updateEntryId={updateEntryId} />
          </Suspense>
        }
      />
    </>
  );
};

export default Page;

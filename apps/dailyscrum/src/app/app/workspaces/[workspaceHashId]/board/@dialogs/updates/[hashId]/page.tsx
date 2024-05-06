import React, { Suspense } from "react";
import EditUpdateDialog from "./edit-update-dialog";
import EditUpdateDialogContentLoader from "./edit-update-dialog-content-loader";
import sqids from "@/lib/sqids";

type Props = {
  params: {
    hashId: string;
  };
};

const Page = ({ params }: Props) => {
  const id = sqids.decode(params.hashId);
  const updateEntryId: number | undefined = id[0];

  if (!updateEntryId) {
    return null;
  }

  return (
    <EditUpdateDialog
      content={
        // TODO: work on suspense fallback
        <Suspense fallback={<div>Loading...</div>}>
          <EditUpdateDialogContentLoader updateEntryId={updateEntryId} />
        </Suspense>
      }
    />
  );
};

export default Page;

import React, { Suspense } from "react";
import AddUpdateDialog from "./add-update-dialog";
import AddUpdateDialogContentLoader from "./add-update-dialog-content-loader";

type Props = {
  params: {
    workspaceHashId: string;
  };
};

const Page = ({ params }: Props) => {
  return (
    <AddUpdateDialog
      content={
        // TODO: apply skeleton
        <Suspense fallback={null}>
          <AddUpdateDialogContentLoader
            workspaceHashId={params.workspaceHashId}
          />
        </Suspense>
      }
    />
  );
};

export default Page;

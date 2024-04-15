import React from "react";
import AddMemberDialogLoader from "./add-member-dialog-loader";

type Props = {
  params: {
    workspaceHashId: string;
  };
};

const Page = ({ params }: Props) => {
  return <AddMemberDialogLoader workspaceHashId={params.workspaceHashId} />;
};

export default Page;

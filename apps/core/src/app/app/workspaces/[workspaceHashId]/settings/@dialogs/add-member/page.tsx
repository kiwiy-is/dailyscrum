import React, { Suspense } from "react";
import InvitationLinkSectionLoader from "./invitation-link-section-loader";
import AddMemberDialog from "./add-member-dialog";
import InvitationLinkSectionSkeleton from "./invitation-link-section-skeleton";

type Props = {
  params: {
    workspaceHashId: string;
  };
};

// TODO: manage the modal with query string instead of pathname
const Page = ({ params }: Props) => {
  return (
    <AddMemberDialog
      invitationLinkSection={
        <Suspense fallback={<InvitationLinkSectionSkeleton />}>
          <InvitationLinkSectionLoader
            workspaceHashId={params.workspaceHashId}
          />
        </Suspense>
      }
    />
  );
};

export default Page;

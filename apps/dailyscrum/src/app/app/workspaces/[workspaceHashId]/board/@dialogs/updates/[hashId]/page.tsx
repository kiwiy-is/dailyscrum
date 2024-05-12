import React, { Suspense } from "react";
import EditUpdateDialog from "./edit-update-dialog";
import EditUpdateDialogContentLoader from "./edit-update-dialog-content-loader";
import sqids from "@/lib/sqids";
import { NextPage } from "next";
import { notFound } from "next/navigation";
import { getDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import { getCurrentUser } from "@/services/users";

type Props = {
  params: {
    workspaceHashId: string;
    hashId: string;
  };
};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    const { hashId } = props.params;
    const [id] = sqids.decode(hashId);

    if (!id) {
      return notFound();
    }

    const [{ data: updateEntry }, { data: currentUser }] = await Promise.all([
      getDailyScrumUpdateEntry(id),
      getCurrentUser(),
    ]);

    if (updateEntry?.user?.id !== currentUser?.id) {
      return notFound();
    }

    return <Page {...props} />;
  };

  return Wrapper;
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

export default pageFlowHandler(Page);

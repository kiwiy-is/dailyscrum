import { Suspense } from "react";
import PageFlowHandler from "./page-flow-handler";

type Props = {};

const Page = async () => {
  return (
    <>
      <Suspense>
        <PageFlowHandler />
      </Suspense>
    </>
  );
};

export default Page;

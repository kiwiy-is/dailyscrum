import { NextPage } from "next";
import {
  redirectToWorkspaceBoard,
  redirectIfNotSignedIn,
} from "@/lib/page-flows";

type Props = {};

const pageFlowHandler = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    await redirectIfNotSignedIn();
    await redirectToWorkspaceBoard();
  };

  return Wrapper;
};

const Page = async () => {
  return null;
};

export default pageFlowHandler(Page);

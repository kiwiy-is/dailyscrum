import {
  redirectIfNotSignedIn,
  redirectToWorkspaceBoard,
} from "@/lib/page-flows";

type Props = {};

const PageFlowHandler = async (props: Props) => {
  await redirectIfNotSignedIn();
  await redirectToWorkspaceBoard();
  return null;
};

export default PageFlowHandler;

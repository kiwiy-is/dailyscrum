import {
  redirectIfNotSignedIn,
  redirectIfProfileDoesntExist,
  redirectToWorkspaceBoard,
} from "@/lib/page-flows";

type Props = {};

const PageFlowHandler = async (props: Props) => {
  await redirectIfNotSignedIn();
  await redirectIfProfileDoesntExist();
  await redirectToWorkspaceBoard();
  return null;
};

export default PageFlowHandler;

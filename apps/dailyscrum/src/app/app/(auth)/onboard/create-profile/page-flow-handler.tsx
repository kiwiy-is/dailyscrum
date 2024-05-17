import { redirectIfNotSignedIn } from "@/lib/page-flows";

type Props = {};

const PageFlowHandler = async (props: Props) => {
  await redirectIfNotSignedIn();

  return null;
};

export default PageFlowHandler;

import { redirectIfSignedIn } from "@/lib/page-flows";

type Props = {};

const PageFlowHandler = async (props: Props) => {
  await redirectIfSignedIn();

  return null;
};

export default PageFlowHandler;

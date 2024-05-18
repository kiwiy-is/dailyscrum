import { redirectIfSignedIn } from "@/lib/page-flows";

type Props = {};

// TODO: kick out if email search param don't exist
// TODO: kick out if it's invalid email
const PageFlowHandler = async (props: Props) => {
  await redirectIfSignedIn();

  return null;
};

export default PageFlowHandler;

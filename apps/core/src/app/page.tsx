import { redirect } from "next/navigation";
import { NextPage } from "next";

type Props = {};

const routeMiddleware = (Page: NextPage<Props>) => {
  const Wrapper = async (props: Props) => {
    return redirect("/app");
  };

  return Wrapper;
};

const Page = async () => {
  return null;
};

export default routeMiddleware(Page);

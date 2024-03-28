import React from "react";
import Redirector from "./redirector";

export const dynamic = "force-dynamic";

// NOTE: A double rendering after redirect form server action workaround: https://github.com/vercel/next.js/issues/57257#issuecomment-1959516538
const Page = ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const toParamValue = searchParams["to"];
  const to = toParamValue
    ? Array.isArray(toParamValue)
      ? decodeURIComponent(toParamValue[0])
      : decodeURIComponent(toParamValue)
    : "/";

  return <Redirector to={to} />;
};

export default Page;

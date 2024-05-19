"use client";

import { useContext, useEffect } from "react";
import { PageDataContext } from "./page-data-context";

type Props = {
  timeZone: string;
};

const PageSetter = ({ timeZone }: Props) => {
  const { setTimeZone } = useContext(PageDataContext);

  useEffect(() => {
    setTimeZone(timeZone);
  }, [timeZone, setTimeZone]);

  return null;
};

export default PageSetter;

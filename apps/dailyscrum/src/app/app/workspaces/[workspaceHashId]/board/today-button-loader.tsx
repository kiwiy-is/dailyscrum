"use client";

import { useContext } from "react";
import TodayButton from "./today-button";
import { PageDataContext } from "./page-data-context";

type Props = {};

const TodayButtonLoader = (props: Props) => {
  const {
    data: {
      currentWorkspace: { timeZone },
    },
  } = useContext(PageDataContext);

  if (!timeZone) {
    throw Promise.reject();
  }

  return <TodayButton timeZone={timeZone} />;
};

export default TodayButtonLoader;

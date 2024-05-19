"use client";

import { useContext } from "react";
import { PageDataContext } from "./page-data-context";
import DatePicker from "./date-picker";

type Props = {};

const DatePickerLoader = (props: Props) => {
  const {
    data: {
      currentWorkspace: { timeZone },
    },
  } = useContext(PageDataContext);

  if (!timeZone) {
    throw Promise.reject();
  }

  return <DatePicker timeZone={timeZone} />;
};

export default DatePickerLoader;

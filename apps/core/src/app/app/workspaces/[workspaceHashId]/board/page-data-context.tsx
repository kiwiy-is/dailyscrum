"use client";

import { SetStateAction, createContext, useState, type Dispatch } from "react";

export const PageDataContext = createContext<{
  data: {
    currentWorkspace: {
      timeZone: string | null;
    };
  };
  setTimeZone: Dispatch<SetStateAction<string | null>>;
}>({
  data: {
    currentWorkspace: {
      timeZone: null,
    },
  },
  setTimeZone: () => {},
});

export const PageDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [timeZone, setTimeZone] = useState<string | null>(null);

  const data = {
    currentWorkspace: {
      timeZone,
    },
  };

  return (
    <PageDataContext.Provider value={{ data, setTimeZone }}>
      {children}
    </PageDataContext.Provider>
  );
};

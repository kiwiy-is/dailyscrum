import React from "react";

type Props = {
  children?: React.ReactNode;
  dialogs: React.ReactNode;
};

const Layout = ({ children, dialogs }: Props) => {
  return (
    <>
      {children}
      {dialogs}
    </>
  );
};

export default Layout;

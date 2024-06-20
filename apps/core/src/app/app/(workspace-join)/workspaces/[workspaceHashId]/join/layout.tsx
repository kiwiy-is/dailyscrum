import CenteredContentLayout from "@/components/centered-content-layout";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <CenteredContentLayout>{children}</CenteredContentLayout>;
};

export default Layout;

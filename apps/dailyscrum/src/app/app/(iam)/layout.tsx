import Link from "next/link";
import React from "react";
import { KiwiyIsSymbol } from "ui/kiwiy-is-symbol";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-8 px-4">
      <KiwiyIsSymbol width={32} height={32} />
      <div className="w-full sm:!w-[440px]">{children}</div>
    </div>
  );
};

export default Layout;

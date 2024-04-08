"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

type Props = {
  to: string;
};

const Redirector = ({ to }: Props) => {
  useEffect(() => {
    redirect(to);
  }, []);

  return null;
};

export default Redirector;

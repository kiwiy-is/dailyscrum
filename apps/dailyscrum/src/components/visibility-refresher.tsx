"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

const VisibilityRefresher = (props: Props) => {
  const router = useRouter();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    if (document.visibilityState === "visible") {
      handleVisibilityChange();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [router]);

  return null;
};

export default VisibilityRefresher;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "ui";

type Props = React.ComponentProps<typeof Link> & {
  activeClassName?: string;
  children: React.ReactNode;
};

const NavLink = ({ children, ...props }: Props) => {
  const pathname = usePathname();

  const isActive = pathname === props.href;

  return (
    <Link
      {...props}
      className={cn(props.className, isActive && props.activeClassName)}
    >
      {children}
    </Link>
  );
};

export default NavLink;

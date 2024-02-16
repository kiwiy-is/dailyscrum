import { NavLink, useParams } from "@remix-run/react";
import { buttonVariants } from "~/lib/shadcn/ui";
import { cn } from "~/lib/shadcn/lib/utils";

export default function Navigation() {
  const params = useParams();
  return (
    <nav className="flex flex-col gap-y-1">
      <NavLink
        to={`/${params.teamId}/dashboard`}
        className={({ isActive }) => {
          return cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            isActive ? "bg-accent" : "",
            "justify-start"
          );
        }}
      >
        Dashboard
      </NavLink>

      {/* <NavLink
        to={`/${params.teamId}/my-history`}
        className={({ isActive }) => {
          return cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            isActive ? "bg-accent" : "",
            "justify-start"
          );
        }}
      >
        My history
      </NavLink> */}

      <NavLink
        to={`/${params.teamId}/settings`}
        className={({ isActive }) => {
          return cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            isActive ? "bg-accent" : "",
            "justify-start"
          );
        }}
      >
        Settings
      </NavLink>
    </nav>
  );
}

import { Outlet } from "@remix-run/react";

export default function () {
  return (
    <div>
      my scrum history <Outlet />
    </div>
  );
}

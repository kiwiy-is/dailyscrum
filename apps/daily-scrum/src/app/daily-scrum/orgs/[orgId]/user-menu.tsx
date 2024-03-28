import { UserRoundIcon } from "lucide-react";
import React from "react";
import { Button } from "ui/button";
import UserDropdown from "./user-dropdown";
import { getCurrentUser } from "@/services/users";

type Props = {};

const UserMenu = async (props: Props) => {
  const { data: user, error } = await getCurrentUser();

  if (error || !user) {
    return null;
  }

  const { email } = user;

  return (
    <UserDropdown
      trigger={
        <Button variant="ghost" className="justify-start gap-x-2" size="sm">
          <UserRoundIcon width={16} height={16} strokeWidth={2} />
          <span className="truncate">{email}</span>
        </Button>
      }
      label={email}
    />
  );
};

export default UserMenu;

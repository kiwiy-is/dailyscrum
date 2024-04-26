import { UserRoundIcon } from "lucide-react";
import React from "react";
import { Button } from "ui/button";
import UserDropdown from "./user-dropdown";
import { getCurrentUser } from "@/services/users";
import { getCurrentUserProfile } from "@/services/profiles";

type Props = {};

const UserMenu = async (props: Props) => {
  const { data: profile, error: getProfileError } =
    await getCurrentUserProfile();

  if (getProfileError || !profile) {
    return null;
  }

  return (
    <UserDropdown
      trigger={
        <Button variant="ghost" className="justify-start gap-x-2">
          <div>
            <UserRoundIcon width={16} height={16} strokeWidth={2} />
          </div>
          <span className="truncate">{profile.name}</span>
        </Button>
      }
      label={profile.name}
    />
  );
};

export default UserMenu;

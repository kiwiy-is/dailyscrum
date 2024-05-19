"use client";

import {
  SettingsIcon,
  LogOutIcon,
  SunMoonIcon,
  PaletteIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "ui/dropdown-menu";
import { signOut } from "./actions";
import { useQueryState } from "nuqs";

type Props = {
  trigger?: React.ReactNode;
  label?: React.ReactNode;
};

const UserDropdown = ({ trigger, label, ...props }: Props) => {
  const [dialog, setDialog] = useQueryState("dialog");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56" align="start">
        <DropdownMenuLabel className="truncate">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setDialog("account-settings");
            }}
          >
            <SettingsIcon
              className="mr-2"
              width={16}
              height={16}
              strokeWidth={2}
            />
            <span>Account settings</span>
          </DropdownMenuItem>
          {/* TODO: Implement appearance settings */}
          {/* <DropdownMenuItem>
            <PaletteIcon
              className="mr-2"
              width={16}
              height={16}
              strokeWidth={2}
            />
            <span>Appearance</span>
          </DropdownMenuItem> */}
          {/* TODO: Implement theme settings */}
          {/* <DropdownMenuItem>
            <SunMoonIcon
              className="mr-2"
              width={16}
              height={16}
              strokeWidth={2}
            />
            <span>Toggle theme</span>
          </DropdownMenuItem>{" "} */}
          <DropdownMenuItem
            onSelect={async () => {
              await signOut();
            }}
          >
            <LogOutIcon
              className="mr-2"
              width={16}
              height={16}
              strokeWidth={2}
            />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

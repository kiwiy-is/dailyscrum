"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "ui";
import { Button } from "ui/button";
import {
  CommandInput,
  CommandItem,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "ui/shadcn-ui/popover";

type Org = {
  id: string;
  name: string;
};

type Props = {
  orgs: Org[];
  selectedOrg: Org;
  onOrgSelect: (orgId: string) => void;
};

function OrgSelection({ orgs, selectedOrg, onOrgSelect }: Props) {
  const [open, setOpen] = useState(false);

  const handleCommandItemSelect = useCallback(
    (orgId: string) => () => {
      setOpen(false);
      onOrgSelect(orgId);
    },
    [onOrgSelect]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          size="sm"
          className={cn("w-full justify-between")}
        >
          {selectedOrg.name}
          <ChevronsUpDownIcon
            className="ml-auto h-4 w-4 shrink-0 "
            strokeWidth={1}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {orgs.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={handleCommandItemSelect(team.id)}
                >
                  {team.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg.id === team.id ? "" : "opacity-0"
                    )}
                    strokeWidth={1}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator alwaysRender />

            <CommandGroup forceMount>
              <CommandItem onSelect={() => {}} forceMount>
                <PlusCircleIcon className="mr-2 h-4 w-4 " strokeWidth={1} />
                Create Org
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default OrgSelection;

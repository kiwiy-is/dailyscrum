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

type Team = {
  id: string;
  name: string;
};

type Props = {
  teams: Team[];
  selectedTeam: Team;
  onTeamSelect: (teamId: string) => void;
};

function TeamSelection({ teams, selectedTeam, onTeamSelect }: Props) {
  const [open, setOpen] = useState(false);

  const handleCommandItemSelect = useCallback(
    (teamId: string) => () => {
      setOpen(false);
      onTeamSelect(teamId);
    },
    [onTeamSelect]
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
          {selectedTeam.name}
          <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={handleCommandItemSelect(team.id)}
                >
                  {team.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTeam.id === team.id ? "opacity-50" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator alwaysRender />

            <CommandGroup forceMount>
              <CommandItem onSelect={() => {}} forceMount>
                <PlusCircleIcon className="mr-2 h-4 w-4 opacity-50" />
                Create Team
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default TeamSelection;

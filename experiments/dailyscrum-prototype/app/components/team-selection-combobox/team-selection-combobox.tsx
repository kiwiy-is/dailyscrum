import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/lib/shadcn/ui";
import { cn } from "~/lib/shadcn/lib/utils";
import React from "react";
import type { Team } from "~/data";

type TeamSelectionComboboxProps = {
  teams: Team[];
  selectedTeam: Team;
  onTeamSelect: (teamId: string) => void;
};

export default function TeamSelectionCombobox({
  teams,
  selectedTeam,
  onTeamSelect,
}: TeamSelectionComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const handleCommandItemSelect = React.useCallback(
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
          className={cn("w-[240px] justify-between")}
        >
          {selectedTeam.name}
          <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search team..." />
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  data-name="_action"
                  onSelect={handleCommandItemSelect(team.id)}
                  className="text-sm"
                >
                  {team.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTeam.id === team.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => {}}>
                <PlusCircledIcon className="mr-2 h-5 w-5" />
                Create Team
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

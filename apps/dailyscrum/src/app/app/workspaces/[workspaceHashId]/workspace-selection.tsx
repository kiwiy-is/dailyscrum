"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
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

type Workspace = {
  id: string;
  name: string;
};

type Props = {
  workspaces: Workspace[];
  selectedWorkspace: Workspace;
};

function WorkspaceSelection({ workspaces, selectedWorkspace }: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCommandItemSelect = useCallback(
    (workspaceId: string) => () => {
      setOpen(false);
      router.push(`/app/workspaces/${workspaceId}/board`);
    },
    [router]
  );

  const handleCreateWorkspaceSelect = () => {
    const params = new URLSearchParams(searchParams);
    params.set("dialog", "create-new-workspace");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          aria-label="Select a workspace"
          size="sm"
          className={cn("w-full justify-between", "h-10")}
        >
          {selectedWorkspace.name}
          <ChevronsUpDownIcon
            className="ml-auto h-4 w-4 shrink-0 opacity-50"
            strokeWidth={2}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command
          filter={(value, search) => {
            const workspace = workspaces[parseInt(value, 10)];

            if (workspace?.name.includes(search)) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup>
              {workspaces.map((workspace, index) => (
                <CommandItem
                  key={workspace.id}
                  id={workspace.id}
                  onSelect={handleCommandItemSelect(workspace.id)}
                  value={String(index)} // NOTE: the string value is coerced into lower case. Using index instead of id.
                >
                  {workspace.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedWorkspace.id === workspace.id ? "" : "opacity-0"
                    )}
                    strokeWidth={2}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator alwaysRender />

            <CommandGroup forceMount>
              <CommandItem onSelect={handleCreateWorkspaceSelect} forceMount>
                <PlusCircleIcon className="mr-2 h-4 w-4 " strokeWidth={2} />
                Create a workspace
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default WorkspaceSelection;

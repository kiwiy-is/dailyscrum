"use client";

import { CheckIcon, ChevronsUpDownIcon, PlusCircleIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
};

function OrganizationSelection({ orgs, selectedOrg }: Props) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCommandItemSelect = useCallback(
    (orgId: string) => () => {
      setOpen(false);
      router.push(`/orgs/${orgId}/dashboard`);
    },
    []
  );

  const handleCreateOrgSelect = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("dialog", "create-new-organization");
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an organization"
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
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {orgs.map((org) => (
                <CommandItem
                  key={org.id}
                  onSelect={handleCommandItemSelect(org.id)}
                >
                  {org.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg.id === org.id ? "" : "opacity-0"
                    )}
                    strokeWidth={1}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator alwaysRender />

            <CommandGroup forceMount>
              <CommandItem onSelect={handleCreateOrgSelect} forceMount>
                <PlusCircleIcon className="mr-2 h-4 w-4 " strokeWidth={1} />
                Create an organization
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default OrganizationSelection;

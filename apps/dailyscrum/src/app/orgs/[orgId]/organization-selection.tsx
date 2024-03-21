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
            className="ml-auto h-4 w-4 shrink-0 opacity-50"
            strokeWidth={2}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command
          filter={(value, search) => {
            const org = orgs[parseInt(value, 10)];

            if (org?.name.includes(search)) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {orgs.map((org, index) => (
                <CommandItem
                  key={org.id}
                  id={org.id}
                  onSelect={handleCommandItemSelect(org.id)}
                  value={String(index)} // NOTE: the string value is coerced into lower case. Using index instead of id.
                >
                  {org.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedOrg.id === org.id ? "" : "opacity-0"
                    )}
                    strokeWidth={2}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator alwaysRender />

            <CommandGroup forceMount>
              <CommandItem onSelect={handleCreateOrgSelect} forceMount>
                <PlusCircleIcon className="mr-2 h-4 w-4 " strokeWidth={2} />
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

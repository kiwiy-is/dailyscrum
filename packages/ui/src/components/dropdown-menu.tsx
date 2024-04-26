import * as dropdownMenu from "@/components/shadcn-ui/dropdown-menu";
import { cn } from "@/lib/utils";

export * from "@/components/shadcn-ui/dropdown-menu";

export const DropdownMenuItem = (
  props: React.ComponentProps<typeof dropdownMenu.DropdownMenuItem>
) => {
  const className = cn("cursor-pointer", "py-2 px-3", props.className);
  return <dropdownMenu.DropdownMenuItem {...props} className={className} />;
};

export const DropdownMenuLabel = (
  props: React.ComponentProps<typeof dropdownMenu.DropdownMenuLabel>
) => {
  const className = cn("py-2 px-3", props.className);
  return <dropdownMenu.DropdownMenuLabel {...props} className={className} />;
};

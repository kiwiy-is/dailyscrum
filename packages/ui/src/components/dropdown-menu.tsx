import * as dropdownMenu from "@/components/shadcn-ui/dropdown-menu";
import { cn } from "@/lib/utils";

export * from "@/components/shadcn-ui/dropdown-menu";

export const DropdownMenuItem = (
  props: React.ComponentProps<typeof dropdownMenu.DropdownMenuItem>
) => {
  const className = cn("cursor-pointer", props.className);
  return <dropdownMenu.DropdownMenuItem {...props} className={className} />;
};

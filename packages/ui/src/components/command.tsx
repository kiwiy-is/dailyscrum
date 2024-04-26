import * as command from "@/components/shadcn-ui/command";
import { cn } from "@/lib/utils";
import React from "react";

export * from "@/components/shadcn-ui/command";

export const CommandInput = (
  props: React.ComponentProps<typeof command.CommandInput>
) => {
  const className = cn("h-10", props.className);
  return (
    <div className="[&>div>svg]:stroke-2 [&>div>svg]:opacity-50">
      <command.CommandInput {...props} className={className} />
    </div>
  );
};

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof command.CommandItem>,
  React.ComponentProps<typeof command.CommandItem>
>((props, ref) => {
  const className = cn("text-sm cursor-pointer", "py-2 px-3", props.className);
  return <command.CommandItem ref={ref} {...props} className={className} />;
});
CommandItem.displayName = command.CommandItem.displayName;

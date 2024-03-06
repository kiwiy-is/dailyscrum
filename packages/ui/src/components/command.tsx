import * as command from "@/components/shadcn-ui/command";
import { cn } from "@/lib/utils";

export * from "@/components/shadcn-ui/command";

export const CommandInput = (
  props: React.ComponentProps<typeof command.CommandInput>
) => {
  const className = cn("h-10", props.className);
  return (
    <div className="[&>div>svg]:stroke-1.75 [&>div>svg]:opacity-100">
      <command.CommandInput {...props} className={className} />
    </div>
  );
};

export const CommandItem = (
  props: React.ComponentProps<typeof command.CommandItem>
) => {
  const className = cn("text-sm cursor-pointer", props.className);
  return <command.CommandItem {...props} className={className} />;
};

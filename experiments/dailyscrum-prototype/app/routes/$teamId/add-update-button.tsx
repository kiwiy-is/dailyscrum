import { useSearchParams } from "@remix-run/react";
import { Button, buttonVariants } from "~/lib/shadcn/ui";
import { PlusIcon } from "lucide-react";
import { cn } from "~/lib/shadcn/lib/utils";
import { useCallback } from "react";

export default function AddUpdateButton() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClick = useCallback(() => {
    setSearchParams(
      (prev) => {
        prev.set("dialog", "add-scrum-update");
        return prev;
      },
      {
        preventScrollReset: true,
      }
    );
  }, [setSearchParams]);

  return (
    <Button
      className={cn(buttonVariants({ size: "sm", className: "w-" }))}
      onClick={handleClick}
    >
      <PlusIcon className="mr-2" size="16" />
      Add update
    </Button>
  );
}

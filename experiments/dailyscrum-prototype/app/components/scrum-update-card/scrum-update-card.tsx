import { MoreHorizontalIcon, MoreVerticalIcon } from "lucide-react";
import React from "react";
import { useRef, useState } from "react";
import { cn } from "~/lib/shadcn/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/lib/shadcn/ui";

interface ScrumUpdateCardDropdownMenuItemProps
  extends React.ComponentProps<typeof DropdownMenuItem> {
  children: React.ReactNode;
}

function ScrumUpdateCardDropdownMenuItem({
  children,
  ...props
}: ScrumUpdateCardDropdownMenuItemProps) {
  return <DropdownMenuItem {...props}>{children}</DropdownMenuItem>;
}

interface ScrumUpdateCardProps {
  name: string;
  qaPairs: {
    id: string;
    question: string;
    answerHtml: string;
  }[];
  dropdownMenuItems: React.ReactElement<
    typeof ScrumUpdateCardDropdownMenuItem
  >[];
}

export default function ScrumUpdateCard({
  name,
  qaPairs,
  dropdownMenuItems,
}: ScrumUpdateCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <Card
      className="w-[268px] relative transition-colors hover:bg-accent hover:text-accent-foreground group"
      key={0}
    >
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              open ? "opacity-100" : "opacity-0",
              "h-6 w-6 absolute right-4 top-4 hover:bg-accent-lightness-modified transition-opacity group-hover:opacity-100 focus:opacity-100"
            )}
          >
            <MoreHorizontalIcon size="16" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {/* <DropdownMenuItem onClick={onEditItemClick}>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy link</DropdownMenuItem>
          <DropdownMenuItem>Copy text</DropdownMenuItem> */}
          {dropdownMenuItems.map((item) => React.cloneElement(item))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col gap-y-6">
          {qaPairs.map(({ id, question, answerHtml }) => (
            <div className="flex flex-col gap-y-1" key={id}>
              <h4 className="text-sm font-semibold">{question}</h4>
              <div
                className="text-sm [&>ul]:ml-6 [&>ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: answerHtml }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

ScrumUpdateCard.DropdownMenuItem = ScrumUpdateCardDropdownMenuItem;

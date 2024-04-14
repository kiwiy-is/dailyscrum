"use client";

import { MoreHorizontalIcon } from "lucide-react";
import React, { useState } from "react";
import { cn } from "ui";
import { Button } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui/dropdown-menu";
import { Masonry } from "ui/masonry";
import { Card, CardContent } from "ui/shadcn-ui/card";

const DailyScrumUpdateCard = ({
  userName,
  qaPairs,
}: {
  userName: string;
  qaPairs: {
    id: number;
    question: {
      question: string;
      briefQuestion?: string;
    };
    answer: {
      answer: string;
    };
  }[];
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="relative group" key={0}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn(
              open ? "opacity-100" : "opacity-0",
              "transition	h-6 w-6 absolute right-5 top-5 group-hover:opacity-100 focus:opacity-100"
            )}
          >
            <MoreHorizontalIcon size="16" className="opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Copy text</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CardContent className="p-6">
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col space-y-1.5">
            <h3 className="text-base font-semibold">{userName}</h3>
            {/* TODO: Render created at date properly */}
            <p className="text-xs text-muted-foreground">24 minutes ago</p>
          </div>
          {qaPairs.map(
            ({
              id,
              question,
              answer,
              // answerHtml
            }) => (
              <div className="flex flex-col space-y-1.5" key={id}>
                <h4 className="text-sm font-medium">{question.question}</h4>

                <div className="text-sm [&>ul]:ml-6 [&>ul]:list-disc">
                  {answer.answer}
                  {/* TODO: Render markdown parsed text */}
                </div>
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

type Update = {
  id: number;
  userName: string;
  qaPairs: {
    id: number;
    question: {
      question: string;
      briefQuestion?: string;
    };
    answer: {
      answer: string;
    };
  }[];
};

type Props = {
  updates: Update[];
};

const DailyScrumUpdateList = ({ updates }: Props) => {
  return (
    <Masonry
      // className="min-[784px]:max-w-[496px] min-[1040px]:max-w-[752px] min-[1296px]:max-w-[1008px] min-[1552px]:max-w-[1264px] min-[1808px]:max-w-[1520px]" // 240px
      // className="min-[864px]:max-w-[576px] min-[1160px]:max-w-[872px] min-[1456px]:max-w-[1168px] min-[1752px]:max-w-[1464px] min-[2048px]:max-w-[1760px]" // 280px
      className="max-w-[320px] min-[944px]:max-w-[656px] min-[1280px]:max-w-[992px] min-[1616px]:max-w-[1328px] min-[1952px]:max-w-[1664px] min-[2288px]:max-w-[2000px]" // 320px
      items={updates}
      render={({ id, userName, qaPairs }) => (
        <DailyScrumUpdateCard key={id} userName={userName} qaPairs={qaPairs} />
      )}
      config={{
        gap: [16, 16, 16, 16, 16, 16],
        columns: [1, 2, 3, 4, 5, 6],
        // media: [784, 1040, 1296, 1552, 1808, 99999],
        // media: [864, 1160, 1456, 1752, 2048, 99999],
        media: [944, 1280, 1616, 1952, 2288, 99999],
      }}
    />
  );
};

// // // NOTE: A calculator for masonry grid properties. Use it to calculate.
// function calculateGridProperties(width = 240) {
//   const GAP = 16;
//   const SIDEBAR_WIDTH = 224;
//   const CONTENT_AREA_PADDING = 64;
//   const media = [];
//   let className = "";
//   for (let columnIndex = 0; columnIndex <= 6; columnIndex++) {
//     const columnWidth = (columnIndex + 1) * width + columnIndex * GAP;

//     if (columnIndex === 0) {
//       className += `max-w-[${columnWidth}px]`;
//       continue;
//     }

//     const minWidth = SIDEBAR_WIDTH + CONTENT_AREA_PADDING + columnWidth;
//     media.push(minWidth);
//     className += ` min-[${minWidth}px]:max-w-[${columnWidth}px]`;
//   }

//   return { media, className };
// }

export default DailyScrumUpdateList;

"use client";

import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "ui/shadcn-ui/popover";

type Props = {};

const Sample: React.FC<Props> = (props) => {
  return (
    <div>
      {" "}
      <Popover>
        <PopoverTrigger>Hello!</PopoverTrigger>
        <PopoverContent>World!</PopoverContent>
      </Popover>
    </div>
  );
};

export default Sample;

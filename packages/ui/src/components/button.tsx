import React from "react";
import * as ShadcnButton from "./shadcn-ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";

type BaseButtonVariants = VariantProps<typeof ShadcnButton.buttonVariants>;

type ExtendedButtonVariants = Omit<BaseButtonVariants, "size"> & {
  size?: BaseButtonVariants["size"] | "icon-sm";
};

const buttonVariants = (inputVariants: ExtendedButtonVariants) => {
  const adjustedVariants = {
    ...inputVariants,
    size: inputVariants.size === "icon-sm" ? null : inputVariants.size,
  };
  return ShadcnButton.buttonVariants(adjustedVariants);
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ExtendedButtonVariants {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <ShadcnButton.Button
        ref={ref}
        className={cn(className, [size === "icon-sm" ? "h-9 w-9" : null])}
        size={size === "icon-sm" ? null : size}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

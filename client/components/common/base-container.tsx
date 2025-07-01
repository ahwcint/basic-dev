import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, type HTMLAttributes, type PropsWithChildren } from "react";

type CustomProps = { asChild: boolean };

type BaseContainerProps = Partial<CustomProps> &
  HTMLAttributes<HTMLDivElement> &
  PropsWithChildren;

/**
 * @props asChild
 */
export const BaseContainer = forwardRef<HTMLDivElement, BaseContainerProps>(
  function BaseContainer({ asChild = false, className, ...props }, ref) {
    const Comp = asChild ? Slot : "div";

    return <Comp ref={ref} className={cn("p-2", className)} {...props} />;
  }
);

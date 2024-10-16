"use client";

import React from "react";
import * as HoverCardPrimivite from "@radix-ui/react-hover-card";
import { cn } from "@askgovmy/utils";

const HoverCardRoot = HoverCardPrimivite.Root;

const HoverCardTrigger = HoverCardPrimivite.Trigger;

const HoverCardArrow = HoverCardPrimivite.Arrow;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimivite.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimivite.Content>
>(({ className, align = "end", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimivite.Portal>
    <HoverCardPrimivite.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 flex flex-col space-y-1 bg-white-focuswhite100 border-[1px] border-outline-200 rounded-[8px] p-[5px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </HoverCardPrimivite.Portal>
));
HoverCardContent.displayName = HoverCardPrimivite.Content.displayName;

interface HoverCardProps {
  className?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  option?: React.ComponentProps<typeof HoverCardPrimivite.Content>;
}

const HoverCard: React.FunctionComponent<HoverCardProps> = ({
  className,
  trigger,
  option = { align: "center", sideOffset: 4 },
  children,
}) => {
  return (
    <HoverCardRoot openDelay={400} closeDelay={200}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardPrimivite.Portal>
        <HoverCardPrimivite.Content
          className={cn(
            "z-50 flex flex-col space-y-1 bg-white-focuswhite100 border-[1px] border-outline-200 rounded-[8px] p-[5px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...option}
        >
          {children}
        </HoverCardPrimivite.Content>
      </HoverCardPrimivite.Portal>
    </HoverCardRoot>
  );
};
export default HoverCard;

export {
  HoverCard,
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
};

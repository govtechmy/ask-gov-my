"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@askgovmy/utils";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  FunctionComponent,
  ReactNode,
  forwardRef,
} from "react";

const AvatarRoot = forwardRef<
  ElementRef<typeof AvatarPrimitive.Root>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = forwardRef<
  ElementRef<typeof AvatarPrimitive.Fallback>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-100 border border-outline-200 text-black-700",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  badge?: ReactNode;
}

export const Avatar: FunctionComponent<AvatarProps> = ({
  src,
  name,
  className = "h-10 w-10",
  badge,
}) => {
  const deriveInitials = (name?: string) => {
    if (!name) return "?";
    const words = name.split(" ");
    let initials = "";

    for (const word of words) {
      if (word.trim() !== "") {
        initials += word[0];

        if (initials.length === 2) {
          break;
        }
      }
    }

    return initials.toUpperCase();
  };

  return (
    <div className="relative">
      <AvatarRoot className={cn("relative", className)}>
        {src !== null && <AvatarImage src={src} />}
        {name !== null && (
          <AvatarFallback className={cn("", className)}>
            {deriveInitials(name)}
          </AvatarFallback>
        )}
      </AvatarRoot>
      {badge && <div className="absolute -bottom-1.5 -right-2">{badge}</div>}
    </div>
  );
};

export default Avatar;

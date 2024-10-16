"use client";

import { FunctionComponent, ReactNode } from "react";
import { cn } from "@askgovmy/utils";

interface EmptyProps {
  className?: string;
  from: unknown;
  message?: ReactNode;
  children: ReactNode;
}

const Empty: FunctionComponent<EmptyProps> = ({
  children,
  className,
  from,
  message = "Tiada yang ditetapkan.",
}) => {
  const isEmpty = () => {
    if (Array.isArray(from)) return from.length <= 0;
    return !from;
  };
  return isEmpty() ? (
    <div className={cn("", className)}>
      {typeof message === "string" ? (
        <p className="text-dim-500">{message}</p>
      ) : (
        message
      )}
    </div>
  ) : (
    children
  );
};

export { Empty };

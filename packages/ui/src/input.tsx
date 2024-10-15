import * as React from "react";
import { cn } from "@askgovmy/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  action?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, prefix, suffix, action, ...props }, ref) => {
    const charPads = (value: React.ReactNode) => {
      if (typeof value === "string") return `calc(${value.length}ch + 1.2rem)`;
      if (React.isValidElement(value)) return `2rem`;
      return undefined;
    };

    return (
      <div className="relative flex flex-row gap-2">
        {prefix && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2">
            {typeof prefix === "string" ? (
              <span className="text-dim text-sm">{prefix}</span>
            ) : (
              prefix
            )}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full bg-white shadow-button rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground // focus:border focus:border-askmygovbrand-300  focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 // focus:ring-0 ",
            className
          )}
          ref={ref}
          style={{
            paddingLeft: charPads(prefix),
            paddingRight: charPads(suffix),
          }}
          {...props}
        />
        {suffix && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {typeof suffix === "string" ? (
              <span className="text-dim text-sm">{suffix}</span>
            ) : (
              suffix
            )}
          </div>
        )}
        {action}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

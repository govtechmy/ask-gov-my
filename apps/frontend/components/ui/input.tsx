import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full bg-white shadow-button rounded-md border px-3 py-2 text-sm placeholder:text-muted-foreground // focus:border focus:border-askmygovbrand-300  focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 // focus:ring focus:ring-offset-0 focus:ring-askmygovbrand-600/20 ',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };

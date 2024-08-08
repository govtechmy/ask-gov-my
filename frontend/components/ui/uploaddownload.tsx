import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';

const divVariants = cva(
  'inline-flex select-none items-center justify-center gap-1.5 rounded-lg whitespace-nowrap text-start font-medium active:translate-y-[0.5px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      type: {
        uploadDownload:
          'p-2 px-3 border border-outline-200 hover:border-outline-300 bg-white focus:border-outline-200 focus:ring focus:ring-offset-0 focus:ring-outline-400/20 shadow-button h-[54px] w-[195px]',
      },
    },
    defaultVariants: {
      type: 'uploadDownload',
    },
  },
);

export interface DivProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof divVariants> {
  asChild?: boolean;
}

const StyledUploadDownload = forwardRef<HTMLDivElement, DivProps>(
  ({ className, type, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        className={cn(divVariants({ type, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
StyledUploadDownload.displayName = 'StyledUploadDownload';

export { StyledUploadDownload, divVariants };

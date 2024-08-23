import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes, forwardRef } from 'react';

const divVariants = cva('', {
  variants: {
    variant: {
      uploadDownload:
        'p-2 px-3 border border-outline-200 hover:border-outline-300 bg-white rounded-lg flex items-center gap-1.5 justify-between` focus:border-outline-200 focus:ring focus:ring-offset-0 focus:ring-outline-400/20 shadow-button h-[54px] w-[195px]',
      nameHeader:
        'bg-black-800 text-white rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]',
      modal: '',
      'modal-background':
        'z-10 fixed inset-0 bg-gray-900 flex items-center justify-center bg-opacity-70',
      'modal-display': 'bg-white rounded-xl shadow-lg',
      'modal-header': 'text-black-900 text-lg font-semibold leading-[26px]',
      'modal-body': 'text-black-700 text-sm font-normal',
      Topics:
        'flex text-base font-medium text-askmygovbrand-600 bg-askmygovbrand-50 border-[1px] border-askmygovbrand-200 px-2 py-1 rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'uploadDownload',
  },
});

export interface DivProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof divVariants> {
  asChild?: boolean;
}

const StyledDisplay = forwardRef<HTMLDivElement, DivProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return (
      <Comp
        className={cn(divVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
StyledDisplay.displayName = 'StyledDisplay';

export { StyledDisplay, divVariants };

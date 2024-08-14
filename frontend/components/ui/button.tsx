import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-1.5 rounded-lg whitespace-nowrap text-start font-medium active:translate-y-[0.5px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40',
  {
    variants: {
      variant: {
        primary:
          'from-[#B379FF] to-askmygovbrand-600 border border-askmygovbrand-600 bg-gradient-to-b text-white-forcewhite shadow-button // hover:from-[-37.5%] hover:to-[59.38%] // focus:bg-gradient-to-b focus:from-[#B379FF] focus:to-askmygovbrand-600 focus:border-brand-200 focus:ring focus:ring-offset-0 focus:ring-askmygovbrand-600/20',
        secondary:
          'border border-outline-200 hover:border-outline-300 bg-white focus:border-outline-200 focus:ring focus:ring-offset-0 focus:ring-outline-400/20 shadow-button',
        'secondary-myds':
          'border border-brand-200 hover:border-brand-300 bg-white hover:bg-brand-50 text-mydstextbrand-600 focus:border-brand-200 focus:ring focus:ring-offset-0 focus:ring-brand-600/20 shadow-button',
        'secondary-askmygov':
          'border border-askmygovbrand-200 hover:border-askmygovbrand-300 bg-white hover:bg-askmygovbrand-50 text-askmygovtextbrand-600 focus:border-askmygovbrand-200 focus:ring focus:ring-offset-0 focus:ring-askmygovbrand-600/20 shadow-button',
        tertiary:
          'hover:bg-washed-100 focus:ring focus:ring-offset-0 focus:ring-outline-400/20',
        'tertiary-colour':
          'hover:bg-brand-50 text-brand-600 focus:ring focus:ring-offset-0 focus:ring-brand-600/20',
        'tertiary-askmygov':
          'hover:bg-askmygovbrand-50 hover:text-askmygovbrand-600 focus:border-askmygovbrand-200 focus:ring focus:ring-offset-0 focus:ring-askmygovbrand-600/20',
        'danger-primary':
          'border border-danger-600 bg-danger-600 hover:bg-danger-700 hover:border-danger-700 text-white focus:border-danger-600 focus:ring focus:ring-offset-0 focus:ring-danger-600/20 shadow-button disabled:bg-danger-300 disabled-border-danger-300',
        'icon-threedot':
          'border border-outline-200 hover:border-outline-300 bg-white focus:border-outline-200 focus:ring focus:ring-offset-0 focus:ring-outline-400/20 shadow-button',
        'cancel-box-red':
          'h-8 w-8 rounded-lg items-center justify-center flex hover:bg-[#FEF2F2] hover:dark:bg-[#2B0707]',
        'tertiary-dropdown':
          'hover:bg-washed-100 focus:ring-0 focus:ring-offset-0 rounded-[4px] h-8 justify-start text-sm',
      },
      size: {
        default: '',
        sm: 'px-2.5 py-1.5 text-sm',
        md: 'px-3 py-2 text-base',
        lg: 'px-3 py-2.5 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

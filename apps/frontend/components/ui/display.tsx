import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, forwardRef } from "react";

const divVariants = cva("", {
  variants: {
    variant: {
      uploadDownload:
        "p-2 px-3 border border-outline-200 hover:border-outline-300 bg-white rounded-lg flex items-center gap-1.5 justify-between` focus:border-outline-200 focus:ring focus:ring-offset-0 focus:ring-outline-400/20 shadow-button h-[54px] w-[195px]",
      nameHeader:
        "bg-black-800 text-white rounded-md font-bold text-xs flex justify-center items-center w-[53px] h-[22px]",
      logoBackground:
        "absolute inset-0 rounded-full border border-outline-200 bg-transparent flex items-center justify-center overflow-hidden",
      logoEditor:
        "absolute bottom-0 left-12 h-5 w-5 flex items-center justify-center rounded-full bg-askmygovbrand-600 cursor-pointer",
      nameLogoDisplay:
        "font-poppins text-lg font-semibold flex items-center mt-[6px] h-10",
      Topics:
        "flex text-base font-medium text-askmygovbrand-600 bg-askmygovbrand-50 border-[1px] border-askmygovbrand-200 px-2 py-1 rounded-lg line-clamp-1 lg:max-w-[250px]",
    },
  },
  defaultVariants: {
    variant: "uploadDownload",
  },
});

export interface DivProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof divVariants> {
  asChild?: boolean;
}

const StyledDisplay = forwardRef<HTMLDivElement, DivProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(divVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
StyledDisplay.displayName = "StyledDisplay";

export { StyledDisplay, divVariants };

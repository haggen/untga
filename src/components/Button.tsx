import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "inline-flex gap-1 items-center font-bold rounded",
  variants: {
    size: {
      default: "h-10 px-6",
      small: "h-5 px-3 text-xs",
    },
    variant: {
      primary:
        "bg-orange-800 text-stone-100 hover:bg-orange-700 inset-ring inset-ring-stone-800/30",
      secondary:
        "shadow text-orange-800 bg-orange-800/10 hover:text-orange-700 border-2 border-current",
      nested: "text-orange-800 hover:text-orange-700",
    },
    disabled: {
      true: "cursor-not-allowed filter-grayscale",
    },
  },
});

type Props = Omit<ComponentProps<"button">, "children"> & {
  asChild?: boolean;
  variant?: keyof typeof variants.variants.variant;
  size?: keyof typeof variants.variants.size;
  children: ReactNode;
};

export function Button({
  asChild,
  variant = "primary",
  size = "default",
  className,
  disabled,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      className={variants({ variant, size, disabled, className })}
    />
  );
}

import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/Slot";

const variants = tv({
  base: "inline-flex gap-1 items-center font-bold rounded",
  variants: {
    size: {
      default: "h-10 px-6",
      small: "h-6 px-3 text-xs",
    },
    variant: {
      primary:
        "bg-orange-700 text-stone-100 hover:bg-orange-600 border border-orange-800",
      secondary:
        "text-orange-700 bg-orange-700/10 hover:text-orange-600 border-2 border-current",
      nested: "text-orange-700 hover:text-orange-600",
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

import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/slot";

const variants = tv({
  base: "inline-flex gap-1 items-center font-bold rounded mix-blend-hard-light",
  variants: {
    size: {
      default: "h-10 px-6",
      small: "h-6 px-3 text-xs",
    },
    variant: {
      primary:
        "bg-orange-800 text-neutral-100 hover:bg-orange-700 border border-orange-900",
      secondary:
        "text-orange-800 bg-orange-800/10 hover:text-orange-700 border-2 border-current",
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

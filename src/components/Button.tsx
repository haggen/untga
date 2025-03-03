import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "inline-flex gap-2 items-center font-bold rounded-xs shadow",
  variants: {
    size: {
      default: "h-10 px-6",
      large: "h-12 px-8 text-lg",
    },
    variant: {
      default: "bg-orange-700 text-orange-100",
      secondary: "inset-ring-2 ring-orange-700 text-orange-700",
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
  variant = "default",
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

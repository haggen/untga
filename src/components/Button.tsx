import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center h-10 text-lg px-6 rounded shadow-md transition-colors",
  variants: {
    variant: {
      default: "bg-stone-600 text-stone-100 hover:bg-stone-500",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

type Props = Omit<ComponentProps<"button">, "children"> & {
  asChild?: boolean;
  variant?: "default";
  children: ReactNode;
};

export function Button({
  asChild,
  variant = "default",
  className,
  disabled,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      {...props}
      className={variants({ variant, disabled, className })}
    />
  );
}

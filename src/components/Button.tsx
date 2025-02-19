import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center font-bold h-10 px-6 rounded shadow-sm transition-colors",
  variants: {
    variant: {
      default:
        "bg-orange-600 text-orange-100 hover:bg-orange-500 hover:text-white",
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

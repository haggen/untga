import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "font-serif",
  variants: {
    variant: {
      default: "font-bold text-4xl",
      small: "font-bold text-2xl",
    },
  },
});

type Props = Omit<ComponentProps<"span">, "children"> & {
  asChild?: boolean;
  variant?: keyof typeof variants.variants.variant;
  children: ReactNode;
};

export function Heading({
  asChild,
  variant = "default",
  className,
  ...props
}: Props) {
  const Component = asChild ? Slot : "span";
  return <Component {...props} className={variants({ variant, className })} />;
}

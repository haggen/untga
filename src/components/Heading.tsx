import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "font-serif",
  variants: {
    variant: {
      default: "text-4xl",
    },
  },
});

type Props = Omit<ComponentProps<"span">, "children"> & {
  asChild?: boolean;
  variant?: "default";
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

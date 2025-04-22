import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/simple/Slot";

const variants = tv({
  base: "font-serif",
  variants: {
    variant: {
      large: "text-5xl",
      small: "text-3xl",
    },
  },
});

type Props = HTMLAttributes<HTMLElement> & {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  asChild?: boolean;
  variant?: keyof typeof variants.variants.variant;
};

export function Heading({
  as = "h1",
  asChild,
  variant = "large",
  ...props
}: Props) {
  const Component = asChild ? Slot : as;
  return (
    <Component
      {...props}
      className={variants({ variant, className: props.className })}
    />
  );
}

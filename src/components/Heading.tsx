import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/Slot";

const variants = tv({
  base: "font-serif font-medium",
  variants: {
    variant: {
      default: "text-5xl",
      small: "text-3xl",
    },
  },
});

type Props = HTMLAttributes<HTMLHeadingElement> & {
  asChild?: boolean;
  variant?: keyof typeof variants.variants.variant;
};

export function Heading({ asChild, variant = "default", ...props }: Props) {
  const Component = asChild ? Slot : "h1";
  return (
    <Component
      {...props}
      className={variants({ variant, className: props.className })}
    />
  );
}

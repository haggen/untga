import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/simple/Slot";

const styles = tv({
  base: "font-serif",
  variants: {
    variant: {
      large: "text-5xl",
      small: "text-3xl",
    },
  },
});

export function Heading({
  asChild,
  className,
  variant = "large",
  ...props
}: ComponentPropsWithRef<"h1"> & {
  asChild?: boolean;
  variant?: keyof typeof styles.variants.variant;
}) {
  const Component = asChild ? Slot : "h1";

  return <Component {...props} className={styles({ variant, className })} />;
}

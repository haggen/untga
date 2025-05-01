import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/simple/Slot";

const styles = tv({
  base: "font-serif",
  variants: {
    size: {
      large: "text-5xl",
      small: "text-3xl",
    },
  },
});

export function Heading({
  asChild,
  className,
  size,
  ...props
}: ComponentPropsWithRef<"h1"> & {
  asChild?: boolean;
  size: keyof typeof styles.variants.size;
}) {
  const Component = asChild ? Slot : "h1";
  return <Component {...props} className={styles({ size, className })} />;
}

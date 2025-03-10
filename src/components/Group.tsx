import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex",
  variants: {
    inline: {
      true: "",
      false: "flex-col",
    },
    justify: {
      true: "justify-between",
      false: "",
    },
    depth: {
      1: "gap-12",
      2: "gap-10",
      3: "gap-6",
      4: "gap-4",
      5: "gap-2",
      6: "gap-1",
    },
  },
});

type Props = ComponentProps<"div"> & {
  asChild?: boolean;
  inline?: boolean;
  justify?: boolean;
  depth?: keyof typeof variants.variants.depth;
  children: ReactNode;
};

export function Group({
  asChild,
  className,
  inline = false,
  depth = 6,
  justify,
  ...props
}: Props) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      className={variants({ inline, depth, justify, className })}
      {...props}
    />
  );
}

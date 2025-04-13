import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/Slot";

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
    level: {
      1: "gap-12",
      2: "gap-9",
      3: "gap-6",
      4: "gap-3",
      5: "gap-2",
      6: "gap-1",
    },
  },
});

type Props = ComponentProps<"div"> & {
  asChild?: boolean;
  inline?: boolean;
  justify?: boolean;
  level?: keyof typeof variants.variants.level;
  children: ReactNode;
};

export function Group({
  asChild,
  className,
  inline = false,
  level,
  justify,
  ...props
}: Props) {
  const Component = asChild ? Slot : "div";
  return (
    <Component
      className={variants({ inline, level, justify, className })}
      {...props}
    />
  );
}

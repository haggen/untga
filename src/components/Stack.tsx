import { Slot } from "@/components/Slot";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex flex-col",
  variants: {
    level: {
      1: "gap-12",
      2: "gap-6",
      3: "gap-3",
    },
  },
});

type Props = {
  asChild?: boolean;
  level?: 1 | 2 | 3;
  children: ReactNode;
};

export function Stack({ asChild, level = 1, children }: Props) {
  const Component = asChild ? Slot : "div";
  return <Component className={variants({ level })}>{children}</Component>;
}

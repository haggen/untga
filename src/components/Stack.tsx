import { ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/Slot";

const variants = tv({
  base: "flex flex-col",
  variants: {
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      7: "gap-7",
      8: "gap-8",
      9: "gap-9",
      10: "gap-10",
      11: "gap-11",
      12: "gap-12",
    },
  },
});

type Props = {
  asChild?: boolean;
  gap?: keyof typeof variants.variants.gap;
  children: ReactNode;
};

export function Stack({ asChild, gap = 6, children }: Props) {
  const Component = asChild ? Slot : "div";
  return <Component className={variants({ gap })}>{children}</Component>;
}

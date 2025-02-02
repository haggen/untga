import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "font-bold text-stone-600",
});

type Props = ComponentProps<"a"> & { asChild?: boolean; children: ReactNode };

export function Link({ asChild, className, ...props }: Props) {
  const Component = asChild ? Slot : "a";
  return <Component {...props} className={variants({ className })} />;
}

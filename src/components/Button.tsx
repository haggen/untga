import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center h-10 bg-stone-200 font-bold text-lg px-6 border-1 border-dotted border-stone-400 rounded-xs shadow-sm hover:bg-stone-100",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
    },
  },
});

type Props = Omit<ComponentProps<"button">, "children"> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Button({ asChild, className, disabled, ...props }: Props) {
  const Component = asChild ? Slot : "button";
  return <Component {...props} className={variants({ disabled, className })} />;
}

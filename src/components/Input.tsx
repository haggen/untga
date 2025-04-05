import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex h-10 px-2 items-center bg-stone-100 inset-ring-1 inset-ring-stone-800/30 rounded placeholder:text-stone-500",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
  },
});

type Props = ComponentProps<"input">;

export function Input({ className, disabled, ...props }: Props) {
  return (
    <input
      className={variants({ disabled, className })}
      disabled={disabled}
      {...props}
    />
  );
}

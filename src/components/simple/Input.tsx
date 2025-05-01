import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex h-10 px-2 items-center bg-neutral-100 border border-neutral-500 rounded placeholder:text-neutral-500 mix-blend-hard-light",
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

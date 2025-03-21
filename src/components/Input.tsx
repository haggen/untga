import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex h-10 px-2 items-center bg-stone-100/90 shadow rounded inset-ring inset-ring-current/55 placeholder:text-slate-500",
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

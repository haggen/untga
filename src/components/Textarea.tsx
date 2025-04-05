import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "p-2 bg-stone-100 inset-ring-1 inset-ring-stone-800/30 rounded placeholder:text-stone-500",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
  },
});

type Props = ComponentProps<"textarea">;

export function Textarea({ className, disabled, ...props }: Props) {
  return (
    <textarea
      className={variants({ disabled, className })}
      disabled={disabled}
      {...props}
    />
  );
}

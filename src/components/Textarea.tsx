import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "p-2 bg-stone-100/90 shadow rounded inset-ring inset-ring-current/55 placeholder:text-slate-500",
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

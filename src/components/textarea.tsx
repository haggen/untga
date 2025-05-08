import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "p-2 bg-neutral-100 border border-neutral-400 rounded placeholder:text-neutral-500",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
  },
});

export function Textarea({
  className,
  disabled,
  ...props
}: ComponentPropsWithRef<"textarea">) {
  return (
    <textarea
      className={styles({ disabled, className })}
      disabled={disabled}
      {...props}
    />
  );
}

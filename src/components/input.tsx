import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex h-10 px-2 items-center bg-neutral-100 border border-neutral-500 rounded placeholder:text-neutral-500 mix-blend-hard-light",
  variants: {
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "",
    },
  },
});

export function Input({
  className,
  disabled,
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <input
      className={styles({ disabled, className })}
      disabled={disabled}
      {...props}
    />
  );
}

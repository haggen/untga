import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center h-12 bg-white rounded border border-stone-600 shadow-sm px-2",
});

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={variants(className)} />;
}

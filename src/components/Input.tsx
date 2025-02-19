import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center bg-white shadow-xs h-10 px-2 rounded-xs",
});

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={variants(className)} />;
}

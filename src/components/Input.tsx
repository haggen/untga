import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={twMerge(
        "flex items-center h-10 px-2 bg-orange-100 border-1 border-amber-800 rounded-xs",
        className
      )}
    />
  );
}

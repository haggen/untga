import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={twMerge(
        "flex items-center h-10 px-2 bg-stone-100/90 shadow rounded inset-ring inset-ring-current/55 placeholder:text-slate-500",
        className
      )}
    />
  );
}

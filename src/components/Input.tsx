import { ComponentProps } from "react";
import { tv } from "tailwind-variants";

const variants = tv({
  base: "flex items-center bg-stone-100/90 shadow rounded inset-ring inset-ring-current/55 placeholder:text-slate-500",
  variants: {
    area: {
      true: "p-2",
      false: "h-10 px-2",
    },
  },
});

type Props = ComponentProps<"input" | "textarea"> & {
  area?: boolean;
};

export function Input({ area = false, className, ...props }: Props) {
  if (area) {
    return (
      <textarea
        className={variants({
          area,
          className,
        })}
        {...(props as ComponentProps<"textarea">)}
      />
    );
  }

  return (
    <input
      className={variants({
        area,
        className,
      })}
      {...(props as ComponentProps<"input">)}
    />
  );
}

import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type ItemProps = ComponentProps<"div"> & {
  label: ReactNode;
};

export function Item({ label, children, className, ...props }: ItemProps) {
  return (
    <div
      className={twMerge("flex items-center gap-2 py-0.5", className)}
      {...props}
    >
      <dt className="flex items-center gap-2 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

type ListProps = ComponentProps<"dl">;

export function List({ className, ...props }: ListProps) {
  return <dl className={twMerge("flex flex-col", className)} {...props} />;
}

import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex items-center gap-2 py-0.5",
  variants: {
    interactable: {
      true: "cursor-pointer hover:text-orange-700",
    },
  },
});

export function Item({
  label,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  label: ReactNode;
}) {
  return (
    <div
      className={styles({ className, interactable: !!props.onClick })}
      {...props}
    >
      <dt className="flex items-center gap-2 grow after:content after:grow after:border-t-2 after:border-dotted after:border-current/35">
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export function List({
  className,
  ...props
}: HTMLAttributes<HTMLDListElement>) {
  return <dl className={twMerge("flex flex-col", className)} {...props} />;
}

import { ComponentPropsWithRef, ReactNode } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex items-center gap-2 py-1",
});

export function Item({
  label,
  children,
  className,
  ...props
}: ComponentPropsWithRef<"div"> & {
  label: ReactNode;
}) {
  return (
    <div className={styles({ className })} {...props}>
      <div>{label}</div>
      <div className="grow border-b-2 border-dotted border-current/30" />
      <div>{children}</div>
    </div>
  );
}

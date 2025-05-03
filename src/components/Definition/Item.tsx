import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex items-center gap-2 py-1",
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
    <div className={styles({ className })} {...props}>
      <dt>{label}</dt>
      <div className="grow border-b-2 border-dotted mix-blend-overlay" />
      <dd>{children}</dd>
    </div>
  );
}

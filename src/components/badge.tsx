import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/slot";

const styles = tv({
  base: "px-3 h-6 inline-flex items-center rounded-full bg-slate-600 text-foreground-inverted",
});

type Props = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export function Badge({ asChild, className, children, ...props }: Props) {
  const Component = asChild ? Slot : "span";
  return (
    <Component {...props} className={styles({ className })}>
      {children}
    </Component>
  );
}

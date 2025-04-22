import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/simple/Slot";

const styles = tv({
  base: "px-3 py-0.5 inline-flex rounded-full bg-stone-600 text-stone-100",
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

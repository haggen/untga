import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex flex-col gap-px rounded border border-neutral-500 overflow-hidden  mix-blend-hard-light",
  variants: {
    busy: {
      true: "cursor-wait pointer-events-none",
    },
  },
});

export function List({
  busy,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  busy?: boolean;
}) {
  if (busy) {
    props["aria-busy"] = true;
  }

  return <menu className={styles({ busy, className })} {...props} />;
}

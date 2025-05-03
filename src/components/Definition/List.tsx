import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex flex-col",
});

export function List({ className, ...props }: ComponentPropsWithRef<"dl">) {
  return <dl className={styles({ className })} {...props} />;
}

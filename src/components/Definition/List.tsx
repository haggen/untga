import { ComponentPropsWithRef } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex flex-col",
});

export function List({ className, ...props }: ComponentPropsWithRef<"div">) {
  return <div className={styles({ className })} {...props} />;
}

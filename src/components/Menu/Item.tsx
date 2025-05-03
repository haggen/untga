import { HTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { Command } from "~/components/Command";

const styles = tv({
  base: "flex items-center bg-neutral-400 min-h-12 p-3 w-full focus-visible:outline-0 hover:bg-neutral-300 focus-visible:bg-neutral-300",
});

export function Item({
  href,
  action,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  href?: string;
  action?: () => Promise<void>;
}) {
  const content = href ? (
    <Command href={href} className={styles({ className })}>
      {props.children}
    </Command>
  ) : action ? (
    <Command action={action} className={styles({ className })}>
      {props.children}
    </Command>
  ) : (
    <div className={styles({ className })} {...props}>
      {props.children}
    </div>
  );

  return <li>{content}</li>;
}

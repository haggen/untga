import { HTMLAttributes, ReactNode } from "react";
import { tv } from "tailwind-variants";
import { Command } from "~/components/command";
import { StatelessAction } from "~/lib/actions";

const styles = tv({
  base: "flex items-center bg-neutral-100/50 min-h-12 p-3 w-full focus-visible:outline-0 hover:bg-neutral-100 focus-visible:bg-neutral-100",
});

type Props = HTMLAttributes<HTMLElement> &
  Readonly<{
    href?: string;
    action?: StatelessAction<FormData, void>;
  }>;

export function Item(props: Omit<Props, "href">): ReactNode;
export function Item(props: Omit<Props, "action">): ReactNode;
export function Item(props: Omit<Props, "href" | "action">): ReactNode;
export function Item({ href, action, className, ...props }: Props) {
  if (href) {
    return (
      <li>
        <Command href={href} className={styles({ className })}>
          {props.children}
        </Command>
      </li>
    );
  }

  if (action) {
    return (
      <li>
        <Command action={action} className={styles({ className })}>
          {props.children}
        </Command>
      </li>
    );
  }

  return (
    <li className={styles({ className })} {...props}>
      {props.children}
    </li>
  );
}

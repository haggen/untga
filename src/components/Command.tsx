import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";
import { StatelessAction } from "~/lib/actions";

export function Command(
  props: HTMLAttributes<HTMLElement> & {
    action: StatelessAction<unknown, void>;
  }
): ReactNode;
export function Command(
  props: HTMLAttributes<HTMLElement> & {
    href: string;
  }
): ReactNode;
export function Command({
  action,
  href,
  ...props
}: HTMLAttributes<HTMLElement> & {
  action?: StatelessAction<unknown, void>;
  href?: string;
}) {
  if (href) {
    return <Link href={href} {...props} />;
  }

  if (action) {
    return <button type="submit" {...props} formAction={action} />;
  }

  throw Error("Either 'action' or 'href' prop must be provided.");
}

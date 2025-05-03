import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";

export function Command(
  props: HTMLAttributes<HTMLElement> & {
    action: () => Promise<void>;
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
  action?: () => void;
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

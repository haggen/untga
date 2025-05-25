import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";
import { StatelessAction } from "~/lib/actions";

type Props = HTMLAttributes<HTMLElement> &
  Readonly<{
    href?: string;
    action?: StatelessAction<FormData, void>;
  }>;

export function Command(props: Omit<Props, "href">): ReactNode;
export function Command(props: Omit<Props, "action">): ReactNode;
export function Command({ action, href, ...props }: Props) {
  if (href) {
    return <Link href={href} {...props} />;
  }

  if (action) {
    return <button type="submit" {...props} formAction={action} />;
  }

  throw Error("Either 'action' or 'href' prop must be provided.");
}

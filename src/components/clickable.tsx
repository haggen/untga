"use client";

import { HTMLAttributes, ReactNode } from "react";
import { Link } from "~/components/link";
import { StatelessAction } from "~/lib/actions";

type Props = Readonly<
  HTMLAttributes<HTMLElement> & {
    href?: string;
    action?: StatelessAction<FormData, void>;
  }
>;

/**
 * Render either an <a> or <button> element based on the provided props.
 */
export function Clickable(props: Omit<Props, "href" | "onClick">): ReactNode;
export function Clickable(props: Omit<Props, "href" | "action">): ReactNode;
export function Clickable(props: Omit<Props, "action">): ReactNode;
export function Clickable({ action, href, onClick, ...props }: Props) {
  if (href) {
    return <Link href={href} onClick={onClick} {...props} />;
  }

  if (onClick) {
    return <button type="button" onClick={onClick} {...props} />;
  }

  if (action) {
    return <button type="submit" formAction={action} {...props} />;
  }

  throw Error("Either 'onClick', 'action' or 'href' prop must be provided.");
}

"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<typeof NextLink> & {
  exact?: boolean;
  variant?: { className?: string };
};

export function Link({ href, exact, className, variant, ...props }: Props) {
  const pathname = usePathname();

  // @todo: Better matching algorithm to support next/link's href full specification.
  // e.g. <Link href={{ pathname: "/characters", query: { id: "1" } }} />
  const target = typeof href === "string" ? href : href.pathname ?? "";
  const active = exact ? pathname === target : pathname.startsWith(target);

  return (
    <NextLink
      href={href}
      className={twMerge(className, active ? variant?.className : null)}
      {...props}
    />
  );
}

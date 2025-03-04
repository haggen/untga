"use client";

import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"a"> & {
  activeClassName?: string;
  exact?: boolean;
  children: ReactNode;
};

export function Anchor({ href = "", exact, activeClassName, ...props }: Props) {
  const pathname = usePathname();

  if ((exact && pathname === href) || pathname.startsWith(href)) {
    props.className = twMerge(props.className, activeClassName);
  }

  return <a {...props} href={href} className={props.className} />;
}

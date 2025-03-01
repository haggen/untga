"use client";

import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = ComponentProps<"a"> & {
  activeClassName?: string;
  children: ReactNode;
};

export function Anchor({ href = "", activeClassName, ...props }: Props) {
  const pathname = usePathname();

  if (pathname === href) {
    props.className = twMerge(props.className, activeClassName);
  }

  return <a {...props} href={href} className={props.className} />;
}

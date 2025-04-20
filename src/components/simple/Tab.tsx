"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const styles = tv({
  base: "flex flex-col items-center gap-1 px-3 text-sm text-center truncate",
  variants: {
    active: {
      true: "text-orange-700",
    },
  },
});

type TabProps = ComponentProps<"li"> & {
  href: string;
  exact?: boolean;
};

export function Tab({ href, exact = true, children, ...props }: TabProps) {
  const pathname = usePathname();

  // @todo: Better matching algorithm to support next/link's href full specification.
  // e.g. <Link href={{ pathname: "/characters", query: { id: "1" } }} />
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <li {...props}>
      <Link href={href} className={styles({ active })}>
        {children}
      </Link>
    </li>
  );
}

type BarProps = ComponentProps<"ul">;

export function Bar({ className, ...props }: BarProps) {
  return (
    <ul
      className={twMerge(
        "grid auto-cols-fr grid-flow-col sticky bottom-5",
        className
      )}
      {...props}
    />
  );
}

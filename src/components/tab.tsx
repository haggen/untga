"use client";

import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Link } from "~/components/link";

const styles = tv({
  base: "flex flex-col justify-center items-center gap-1 px-3 h-21 font-bold text-sm truncate",
  variants: {
    active: {
      true: "text-orange-800",
    },
  },
});

export function Tab({
  href,
  exact = true,
  children,
  ...props
}: ComponentProps<"li"> & {
  href: string;
  exact?: boolean;
}) {
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
        "grid auto-cols-fr grid-flow-col sticky bottom-0",
        className
      )}
      {...props}
    />
  );
}

import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "~/components/simple/Slot";

type MenuProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Menu({ asChild, ...props }: MenuProps) {
  const Component = asChild ? Slot : "ul";
  return (
    <Component
      className="flex flex-col gap-px rounded-sm border border-stone-400 overflow-hidden"
      {...props}
    />
  );
}

type ItemProps = HTMLAttributes<HTMLElement> & {
  href?: string;
  asChild?: boolean;
  children: ReactNode;
};

export function Item({ href, onClick, className, ...props }: ItemProps) {
  const Component = href ? Link : onClick ? "button" : "div";

  return (
    <li>
      <Component
        href={href as never} // Appease TypeScript.
        onClick={onClick}
        className={twMerge(
          "block bg-stone-100/30 hover:bg-stone-200/30",
          className
        )}
        {...props}
      />
    </li>
  );
}

Menu.Item = Item;

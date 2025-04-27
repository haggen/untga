import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
import { Slot } from "~/components/simple/Slot";

const styles = tv({
  base: "flex flex-col gap-px rounded-sm border border-stone-900/10 overflow-hidden",
  variants: {
    busy: {
      true: "cursor-wait pointer-events-none opacity-50",
    },
  },
});

export function Menu({
  asChild,
  busy,
  ...props
}: HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  busy?: boolean;
  children: ReactNode;
}) {
  const Component = asChild ? Slot : "menu";

  if (busy) {
    props["aria-busy"] = true;
  }

  return <Component className={styles({ busy })} {...props} />;
}

export function Item({
  href,
  onClick,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  href?: string;
  asChild?: boolean;
  children: ReactNode;
}) {
  const Component = href ? Link : onClick ? "button" : "div";

  return (
    <li>
      <Component
        href={href as never} // Appease TypeScript.
        onClick={onClick}
        className={twMerge(
          "flex items-center bg-gray-300/30 hover:bg-stone-100/30 min-h-12 p-3 w-full focus-visible:outline-0 focus-visible:bg-stone-100/30 w-",
          className
        )}
        {...props}
      />
    </li>
  );
}

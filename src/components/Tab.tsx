import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "~/components/Link";

type TabProps = ComponentProps<"li"> & {
  href: string;
};

export function Tab({ href, children, ...props }: TabProps) {
  return (
    <li {...props}>
      <Link
        href={href}
        className="flex flex-col items-center gap-1 px-3 text-sm text-center truncate"
        variant={{ className: "text-orange-700 " }}
      >
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

Tab.Bar = Bar;

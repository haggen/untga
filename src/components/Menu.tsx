import { Slot } from "@/components/Slot";
import { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type MenuProps = ComponentProps<"ul"> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Menu({ asChild, ...props }: MenuProps) {
  const Component = asChild ? Slot : "ul";

  return <Component className="shadow ring ring-current/10" {...props} />;
}

type ItemProps = ComponentProps<"li"> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Item({ asChild, className, ...props }: ItemProps) {
  const Component = asChild ? Slot : "li";

  return (
    <Component
      className={twMerge(
        "block p-3 bg-orange-100/33 hover:bg-orange-200/50 not-first:border-t border-current/50",
        className
      )}
      {...props}
    />
  );
}

Menu.Item = Item;

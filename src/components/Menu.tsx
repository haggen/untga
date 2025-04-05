import { Slot } from "@/components/Slot";
import { Fragment, HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type MenuProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Menu({ asChild, ...props }: MenuProps) {
  const Component = asChild ? Slot : "ul";
  return (
    <Component
      className="flex flex-col gap-px border rounded border-stone-800/30"
      {...props}
    />
  );
}

type ItemProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Item({ asChild, className, ...props }: ItemProps) {
  // When the item needs to be interactive, we use asChild with an interactive child element, like an <a> or <button>.
  // But since only <li> can be direct descendants of an <ul> we need the wrap.
  const Component = asChild ? Slot : "li";
  const Wrap = asChild ? "li" : Fragment;

  return (
    <Wrap>
      <Component
        className={twMerge(
          "p-4 bg-orange-200/30 hover:bg-orange-100/30",
          className
        )}
        {...props}
      />
    </Wrap>
  );
}

Menu.Item = Item;

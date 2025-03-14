import { Slot } from "@/components/Slot";
import { ComponentProps, Fragment, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type MenuProps = ComponentProps<"ul"> & {
  asChild?: boolean;
  children: ReactNode;
};

export function Menu({ asChild, ...props }: MenuProps) {
  const Component = asChild ? Slot : "ul";
  return (
    <Component
      className="flex flex-col gap-px shadow bg-orange-200/30 inner-glow inner-glow-6 inner-glow-orange-900/50"
      {...props}
    />
  );
}

type ItemProps = ComponentProps<"li"> & {
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
          "block p-4 bg-orange-200/30 hover:bg-orange-100/30",
          className
        )}
        {...props}
      />
    </Wrap>
  );
}

Menu.Item = Item;

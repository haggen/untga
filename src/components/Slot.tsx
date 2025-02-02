import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";

function merge(
  parent: HTMLAttributes<HTMLElement>,
  child: HTMLAttributes<HTMLElement>
) {
  const merged = Object.assign({}, parent, child);

  if (parent.style && child.style) {
    merged.style = { ...child.style, ...parent.style };
  }

  if (parent.className && child.className) {
    merged.className = twMerge(child.className, parent.className);
  }

  return merged;
}

type Props = HTMLAttributes<HTMLElement> & { children: ReactNode };

export function Slot({ children, ...props }: Props) {
  const child = Children.only(children);

  if (!isValidElement(child)) {
    throw new Error("Not a valid element");
  }

  return cloneElement(
    child,
    merge(props, child.props as HTMLAttributes<HTMLElement>)
  );
}

import {
  Children,
  cloneElement,
  CSSProperties,
  HTMLAttributes,
  isValidElement,
} from "react";
import { twMerge } from "tailwind-merge";

type Prop<T> = T extends "style"
  ? CSSProperties
  : T extends "className"
  ? string
  : unknown;

function has<T extends string>(
  props: unknown,
  prop: T
): props is { [prop in T]: Prop<T> } {
  if (typeof props !== "object" || props === null) {
    return false;
  }

  switch (prop) {
    case "style":
      return (
        "style" in props &&
        typeof props.style === "object" &&
        props.style !== null
      );
    case "className":
      return "className" in props && typeof props.className === "string";
    default:
      return prop in props && props[prop as keyof typeof props] !== undefined;
  }
}

function merge<T, U>(parent: T, child: U) {
  let merged = { ...parent, ...child };

  if (has(parent, "style") && has(child, "style")) {
    merged = {
      ...merged,
      style: { ...child.style, ...parent.style },
    };
  }

  if (has(parent, "className") && has(child, "className")) {
    merged = {
      ...merged,
      className: twMerge(child.className, parent.className),
    };
  }

  return merged;
}

type Props = HTMLAttributes<HTMLElement>;

export function Slot({ children, ...props }: Props) {
  const element = Children.only(children);

  if (!isValidElement(element)) {
    throw new Error("Not a valid element");
  }

  return cloneElement(element, merge(props, element.props));
}

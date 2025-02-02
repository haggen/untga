"use client";

import { Context } from "@/components/Form";
import { ReactNode, useContext } from "react";
import { tv } from "tailwind-variants";

type Props = { children?: ReactNode; type: "info" | "error" };

const variants = tv({
  base: "p-3 font-bold",
  variants: {
    type: {
      info: "bg-stone-300",
      error: "text-red-900 bg-red-300",
    },
  },
});

export function Alert({ type, ...props }: Props) {
  const form = useContext(Context);

  if (form.state.error) {
    props.children = form.state.error;
  }

  if (!props.children) {
    return null;
  }

  return <div className={variants({ type })}>{props.children}</div>;
}

"use client";

import { Context } from "@/components/Form";
import { ReactNode, useContext } from "react";
import { tv } from "tailwind-variants";

type Props = {
  children?: ReactNode;
  type?: "neutral" | "negative" | "positive";
};

const variants = tv({
  base: "p-3 ring ring-current/10 shadow",
  variants: {
    type: {
      neutral: "bg-sky-300/33 text-sky-900",
      positive: "bg-green-300/33 text-green-900",
      negative: "bg-rose-300/50 text-rose-900",
    },
  },
});

export function Alert({ ...props }: Props) {
  const form = useContext(Context);

  if (!props.children && typeof form.state === "object") {
    if ("error" in form.state) {
      props.type = "negative";
      props.children = form.state.error;
    } else if ("message" in form.state) {
      props.type = "positive";
      props.children = form.state.message;
    }
  }

  if (!props.type) {
    props.type = "neutral";
  }

  if (!props.children) {
    return null;
  }

  return <div className={variants({ type: props.type })}>{props.children}</div>;
}

"use client";

import { Context } from "@/components/Form";
import { ReactNode, useContext } from "react";
import { tv } from "tailwind-variants";

type Props = {
  children?: ReactNode;
  type?: "neutral" | "negative" | "positive";
};

const variants = tv({
  base: "p-6 rounded border",
  variants: {
    type: {
      neutral: "bg-stone-200 border-stone-400",
      positive: "bg-lime-200 text-lime-600 border-lime-400",
      negative: "text-red-600 bg-red-200 border-red-400",
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

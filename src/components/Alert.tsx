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
      neutral: "bg-orange-200 border-gray-600",
      positive: "bg-lime-200 text-lime-800 border-lime-600",
      negative: "bg-red-200 text-red-800 border-red-600",
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

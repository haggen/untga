"use client";

import { useRouter } from "next/navigation";
import { HTMLAttributes, MouseEvent } from "react";
import { Slot } from "~/components/slot";

export function Back({
  asChild,
  ...props
}: HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "a";
  const router = useRouter();

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    router.back();
  };

  return <Component onClick={onClick}>{props.children}</Component>;
}

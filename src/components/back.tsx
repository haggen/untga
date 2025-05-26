"use client";

import { useRouter } from "next/navigation";
import { HTMLAttributes, MouseEvent } from "react";
import { Clickable } from "~/components/clickable";
import { Slot } from "~/components/slot";

export function Back({
  asChild,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { asChild?: boolean }) {
  const Component = asChild ? Slot : Clickable;
  const router = useRouter();

  const onClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    router.back();
  };

  return (
    <Component onClick={onClick} {...props}>
      {children}
    </Component>
  );
}

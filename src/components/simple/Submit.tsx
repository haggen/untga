"use client";

import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/simple/Button";

export function Submit({ children, ...props }: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? "Loading..." : children}
    </Button>
  );
}

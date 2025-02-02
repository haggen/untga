"use client";

import { Button } from "@/components/Button";
import { Context } from "@/components/Form";
import { ComponentProps, ReactNode, useContext } from "react";

type Props = ComponentProps<"button"> & {
  children: ReactNode;
};

export function Submit({ children }: Props) {
  const form = useContext(Context);

  return (
    <Button type="submit" disabled={form.pending}>
      {children}
    </Button>
  );
}

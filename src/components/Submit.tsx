"use client";

import { ComponentProps, ReactNode, useContext } from "react";
import { Button } from "~/components/Button";
import { Context } from "~/components/Form";

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

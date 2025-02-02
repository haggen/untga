"use client";

import { Action } from "@/lib/types";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useActionState,
} from "react";

type Props<T extends Action> = Omit<
  ComponentProps<"form">,
  "action" | "children"
> & {
  action: T;
  children: ReactNode;
};

export const Context = createContext({
  state: { error: "" },
  pending: false,
});

export function Form<T extends Action>({ children, ...props }: Props<T>) {
  const [state, action, pending] = useActionState(props.action, {
    error: "",
  });

  return (
    <form {...props} action={action}>
      <Context.Provider value={{ state, pending }}>{children}</Context.Provider>
    </form>
  );
}

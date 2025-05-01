"use client";

import {
  ComponentProps,
  createContext,
  ReactNode,
  useActionState,
} from "react";
import { ActionState, StatefulAction } from "~/lib/actions";

type Props<T extends ActionState> = Omit<
  ComponentProps<"form">,
  "action" | "children"
> & {
  action: StatefulAction<T>;
  children: ReactNode;
};

export const Context = createContext({
  state: undefined as ActionState,
  pending: false,
});

export function Form<T extends ActionState>({ children, ...props }: Props<T>) {
  const [state, action, pending] = useActionState(
    props.action,
    {} as Awaited<T> // @todo figure it out later
  );

  return (
    <form {...props} action={action}>
      <Context.Provider value={{ state, pending }}>{children}</Context.Provider>
    </form>
  );
}

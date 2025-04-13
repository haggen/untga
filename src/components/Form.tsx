"use client";

import {
  ComponentProps,
  createContext,
  ReactNode,
  useActionState,
} from "react";
import { State, StatefulAction } from "~/lib/actions";

type Props<T extends State> = Omit<
  ComponentProps<"form">,
  "action" | "children"
> & {
  action: StatefulAction<T>;
  children: ReactNode;
};

export const Context = createContext({
  state: undefined as State,
  pending: false,
});

export function Form<T extends State>({ children, ...props }: Props<T>) {
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

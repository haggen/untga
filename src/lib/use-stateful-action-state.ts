import { useActionState } from "react";
import { StatefulAction } from "~/lib/actions";

export function useStatefulActionState<P, S>(
  fn: StatefulAction<P, S>,
  initialState?: S
) {
  const [state, action, pending] = useActionState(
    fn,
    initialState as Awaited<S>
  );

  return {
    state,
    action,
    pending,
  };
}

"use client";

import { useActionState } from "react";
import { alert } from "~/components/alert";
import { Button } from "~/components/button";
import { ActionState, StatefulAction } from "~/lib/actions";

export function Form<T extends ActionState>(props: {
  value: { id: number };
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <form className="flex flex-col gap-9" action={action} aria-busy={pending}>
      {alert(state)}

      <input type="hidden" name="characterId" value={props.value.id} />

      <footer className="flex justify-end">
        <Button type="submit" disabled={pending}>
          Delete this character
        </Button>
      </footer>
    </form>
  );
}

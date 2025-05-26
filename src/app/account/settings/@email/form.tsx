"use client";

import { useActionState } from "react";
import { alert } from "~/components/alert";
import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { ActionState, StatefulAction } from "~/lib/actions";

export function Form<T extends ActionState>(props: {
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <form className="flex flex-col gap-9" action={action} aria-busy={pending}>
      {alert(state)}

      <Field name="email">
        <Input
          type="email"
          autoComplete="email"
          required
          placeholder="e.g. player@example.com"
        />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Change my e-mail"}
        </Button>
      </footer>
    </form>
  );
}

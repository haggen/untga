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

      <Field name="password" hint="At least 12 characters.">
        <Input
          type="password"
          required
          minLength={12}
          placeholder="e.g. super-secret-phrase"
          autoComplete="new-password"
        />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          Change my password
        </Button>
      </footer>
    </form>
  );
}

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
    <form className="flex flex-col gap-9 p-section" action={action}>
      {alert(state)}

      <fieldset className="flex flex-col gap-6">
        <Field name="email" label="Registered e-mail">
          <Input
            type="email"
            required
            autoComplete="email"
            placeholder="e.g. player@example.com"
          />
        </Field>
      </fieldset>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          Recover access
        </Button>
      </footer>
    </form>
  );
}

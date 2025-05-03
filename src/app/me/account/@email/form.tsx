"use client";

import { useActionState } from "react";
import { Alert } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Field } from "~/components/Field";
import { Input } from "~/components/Input";
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
      <Alert state={state} />

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

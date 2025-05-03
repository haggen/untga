"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Input } from "~/components/simple/Input";
import { ActionState, StatefulAction } from "~/lib/actions";

export function Form<T extends ActionState>(props: {
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <form className="flex flex-col gap-9" action={action}>
      <Alert state={state} />

      <fieldset className="flex flex-col gap-6">
        <Field name="email" label="E-mail">
          <Input
            type="email"
            autoComplete="email"
            required
            placeholder="e.g. player@example.com"
          />
        </Field>

        <Field name="password" label="Password">
          <Input
            type="password"
            autoComplete="current-password"
            required
            minLength={12}
            placeholder="e.g. super-secret-phrase"
          />
        </Field>
      </fieldset>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Log in"}
        </Button>
      </footer>
    </form>
  );
}

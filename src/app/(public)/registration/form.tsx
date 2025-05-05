"use client";

import { useActionState } from "react";
import { Alert } from "~/components/alert";
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
    <form className="flex flex-col gap-9" action={action}>
      <Alert state={state} />

      <fieldset className="flex flex-col gap-6">
        <Field
          name="email"
          label="E-mail"
          hint="For communication and account recovery."
        >
          <Input
            type="email"
            autoComplete="email"
            required
            placeholder="e.g. player@example.com"
          />
        </Field>

        <Field name="password" label="Password" hint="At least 12 characters.">
          <Input
            type="password"
            autoComplete="password"
            required
            minLength={12}
            placeholder="e.g. super-secret-phrase"
          />
        </Field>
      </fieldset>

      <footer className="flex justify-end">
        <Button size="default" disabled={pending}>
          {pending ? "Wait..." : "Register"}
        </Button>
      </footer>
    </form>
  );
}

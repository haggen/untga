"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Input } from "~/components/simple/Input";
import { StatefulAction } from "~/lib/actions";

export function Form(props: { action: StatefulAction }) {
  const [state, action, pending] = useActionState(props.action, undefined);

  return (
    <form className="flex flex-col gap-9" action={action}>
      <Alert state={state} />

      <fieldset className="flex flex-col gap-6">
        <Field name="email" label="Registered e-mail">
          <Input
            type="email"
            required
            autoComplete="username"
            placeholder="e.g. player@example.com"
          />
        </Field>
      </fieldset>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Recover access"}
        </Button>
      </footer>
    </form>
  );
}

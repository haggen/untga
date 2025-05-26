"use client";

import { alert } from "~/components/alert";
import { Button } from "~/components/button";
import { Field } from "~/components/field";
import { Input } from "~/components/input";
import { ActionState, StatefulAction } from "~/lib/actions";
import { useStatefulActionState } from "~/lib/use-stateful-action-state";

export function Form(props: { action: StatefulAction<FormData, ActionState> }) {
  const { state, action, pending } = useStatefulActionState(props.action);

  return (
    <form className="flex flex-col gap-9 p-section" action={action}>
      {alert(state)}

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

"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Input } from "~/components/simple/Input";
import { Textarea } from "~/components/simple/Textarea";
import { ActionState, StatefulAction } from "~/lib/actions";

export function Form<T extends ActionState>(props: {
  value: { name: string; description: string | null };
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <form className="flex flex-col gap-9" action={action} aria-busy={pending}>
      <Alert state={state} />

      <fieldset className="flex flex-col gap-6">
        <Field label="Name" hint="You can't change the character's name.">
          <Input type="text" disabled value={props.value.name} />
        </Field>

        <Field
          name="description"
          label="Bio"
          hint="This information is public. Limit of 256 characters."
        >
          <Textarea
            rows={4}
            maxLength={256}
            placeholder="e.g. The child of a blacksmith..."
            defaultValue={props.value.description ?? ""}
          />
        </Field>
      </fieldset>

      <footer className="flex items-center justify-end gap-2">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Update character"}
        </Button>
      </footer>
    </form>
  );
}

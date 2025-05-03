"use client";

import { useActionState } from "react";
import { Alert } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Field } from "~/components/Field";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import { ActionState, StatefulAction } from "~/lib/actions";

export function Form<T extends ActionState>(props: {
  value: { id: number; name: string; description: string | null };
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
        <input type="hidden" name="characterId" value={props.value.id} />

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

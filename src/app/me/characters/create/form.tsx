"use client";

import { Dices } from "lucide-react";
import { useActionState, useRef } from "react";
import { Alert } from "~/components/Alert";
import { Button } from "~/components/Button";
import { Field } from "~/components/Field";
import { Input } from "~/components/Input";
import { Textarea } from "~/components/Textarea";
import { ActionState, StatefulAction } from "~/lib/actions";
import { random } from "~/lib/random";
import { names } from "~/static/names";

export function Form<T extends ActionState>(props: {
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomName = () => {
    if (inputRef.current) {
      inputRef.current.value = random.draw(names);
    }
  };

  return (
    <form className="flex flex-col gap-9" action={action}>
      <Alert state={state} />

      <fieldset className="flex flex-col gap-6">
        <Field
          name="name"
          label="Name"
          hint="Max of 24 characters. You won't be able to change this later."
        >
          <Input
            ref={inputRef}
            type="text"
            required
            maxLength={24}
            placeholder="e.g. Ragnar"
            pattern="[a-zA-Z0-9\s]+"
          />
          <Button type="button" variant="secondary" onClick={getRandomName}>
            <Dices />
          </Button>
        </Field>

        <Field
          name="description"
          label="Bio"
          hint="This information is public and you can change it later. Max of 256 characters."
        >
          <Textarea
            rows={4}
            maxLength={256}
            placeholder="e.g. The child of a blacksmith..."
          />
        </Field>
      </fieldset>

      <footer className="flex justify-end">
        <Button size="default" disabled={pending}>
          {pending ? "Wait..." : "Create character"}
        </Button>
      </footer>
    </form>
  );
}

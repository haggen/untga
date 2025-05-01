"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Heading } from "~/components/simple/Heading";
import { Input } from "~/components/simple/Input";
import { ActionState, StatefulAction } from "~/lib/actions";

export function ChangePasswordForm<T extends ActionState>(props: {
  action: StatefulAction<FormData, T>;
}) {
  const [state, action, pending] = useActionState(
    props.action,
    undefined as Awaited<T>
  );

  return (
    <form className="flex flex-col gap-9" action={action} aria-busy={pending}>
      <header className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Change your e-mail</h2>
        </Heading>
        <p>
          Type your new e-mail in the input below and confirm. You&apos;ll
          receive an additional e-mail verification message in your inbox.
        </p>
      </header>

      <Alert state={state} />

      <Field name="password" hint="At least 12 characters.">
        <Input
          type="password"
          required
          minLength={12}
          placeholder="e.g. super-secret-phrase"
        />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Change my password"}
        </Button>
      </footer>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Heading } from "~/components/simple/Heading";
import { ActionState, StatefulAction } from "~/lib/actions";

export function AccountDeletionForm<T extends ActionState>(props: {
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
          <h2>Delete your account</h2>
        </Heading>
        <p>
          By clicking on the button below you agree to have all your data,
          including your characters progression, be purged from our system. Some
          information, like IP addresses, may take a little longer to be
          completely removed from our logs.
        </p>
      </header>

      <Alert state={state} />

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={pending}>
          {pending ? "Wait..." : "Delete my account"}
        </Button>
      </footer>
    </form>
  );
}

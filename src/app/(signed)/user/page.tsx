"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { FormEvent } from "react";

function EmailForm() {
  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ["users"],
    mutationFn: (payload: FormData) =>
      client.request("/api/users", {
        method: "PATCH",
        payload,
      }),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutate(payload);
  };

  return (
    <Stack gap={6} asChild>
      <form onSubmit={onSubmit} aria-busy={isPending}>
        <Stack gap={2}>
          <Heading variant="small" asChild>
            <h2>Change your e-mail</h2>
          </Heading>
          <p>
            Type your new e-mail in the input below and confirm. You&apos;ll
            receive an additional e-mail verification message in your inbox.
          </p>
        </Stack>

        {error ? <Alert type="negative">{JSON.stringify(error)}</Alert> : null}

        {data ? <Alert type="positive">{JSON.stringify(data)}</Alert> : null}

        <div className="flex gap-4">
          <Field name="email" className="grow">
            <Input type="email" required placeholder="e.g. me@example.com" />
          </Field>
          <Button type="submit" size="default" disabled={isPending}>
            Confirm
          </Button>
        </div>
      </form>
    </Stack>
  );
}

function PasswordForm() {
  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ["users"],
    mutationFn: (payload: FormData) =>
      client.request("/api/users", {
        method: "PATCH",
        payload,
      }),
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutate(payload);
  };

  return (
    <Stack gap={6} asChild>
      <form onSubmit={onSubmit} aria-busy={isPending}>
        <Stack gap={2}>
          <Heading variant="small" asChild>
            <h2>Change your password</h2>
          </Heading>
          <p>Type your new password in the input below and confirm.</p>
        </Stack>

        {error ? <Alert type="negative">{JSON.stringify(error)}</Alert> : null}

        {data ? <Alert type="positive">{JSON.stringify(data)}</Alert> : null}

        <div className="flex gap-4">
          <Field
            name="password"
            hint="At least 12 characters."
            className="grow"
          >
            <Input
              type="password"
              required
              minLength={12}
              placeholder="e.g. super-secret-phrase"
            />
          </Field>
          <Button type="submit" size="default" disabled={isPending}>
            Confirm
          </Button>
        </div>
      </form>
    </Stack>
  );
}

export default function Page() {
  return (
    <Stack gap={10} asChild>
      <main>
        <Stack gap={4} asChild>
          <header>
            <Heading asChild>
              <h1>Profile</h1>
            </Heading>
          </header>
        </Stack>

        <EmailForm />

        <PasswordForm />
      </main>
    </Stack>
  );
}

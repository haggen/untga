"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import type { Session } from "@/lib/prisma";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { FormEvent } from "react";

function Sessions() {
  const session = useSession();

  const query = useQuery({
    queryKey: ["users", session.userId, "sessions"],
    queryFn: () =>
      client.request<{ data: Session[] }>(
        `/api/users/${session.userId}/sessions`
      ),
  });

  const mutation = useMutation({
    mutationFn: (sessionId: number) =>
      client.request(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      query.refetch();
    },
  });

  return (
    <Stack gap={6} asChild>
      <section>
        <Stack gap={2}>
          <Heading variant="small" asChild>
            <h2>Sessions</h2>
          </Heading>
          <p>
            Check out your session history and invalidate your active sessions.
          </p>
        </Stack>

        {mutation.error ? (
          <Alert type="negative">{JSON.stringify(mutation.error)}</Alert>
        ) : null}

        {mutation.data ? (
          <Alert type="positive">{JSON.stringify(mutation.data)}</Alert>
        ) : null}

        <ul>
          {query.data?.payload.data.map((session) => (
            <li key={session.id}>{String(session.createdAt)}</li>
          ))}
        </ul>
      </section>
    </Stack>
  );
}

function EmailForm() {
  const { mutate, data, error, isPending } = useMutation({
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

        <Field name="email" className="grow">
          <Input type="email" required placeholder="e.g. me@example.com" />
        </Field>

        <footer className="flex justify-end">
          <Button type="submit" size="default" disabled={isPending}>
            Confirm <CircleCheckBig />
          </Button>
        </footer>
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

        <Field name="password" hint="At least 12 characters." className="grow">
          <Input
            type="password"
            required
            minLength={12}
            placeholder="e.g. super-secret-phrase"
          />
        </Field>

        <footer className="flex justify-end">
          <Button type="submit" size="default" disabled={isPending}>
            Confirm <CircleCheckBig />
          </Button>
        </footer>
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

        <Sessions />

        <EmailForm />

        <PasswordForm />
      </main>
    </Stack>
  );
}

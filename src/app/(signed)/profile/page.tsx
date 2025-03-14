"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Definition } from "@/components/Definition";
import { Field } from "@/components/Field";
import { Geolocation } from "@/components/Geolocation";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { Menu } from "@/components/Menu";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import type { Session } from "@/lib/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { FormEvent } from "react";
import { UAParser } from "ua-parser-js";

function getFormattedUserAgent(userAgent: string) {
  const { browser, os } = UAParser(userAgent);
  return `${browser.name} ${browser.major} on ${os.name}`;
}

function Sessions() {
  const session = useSession();
  const queryClient = useQueryClient();

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
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      query.refetch();
    },
  });

  const sessions = query.data?.payload.data;

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

        {query.isLoading ? (
          <Alert type="neutral">
            <p>Loading...</p>
          </Alert>
        ) : (
          <Menu>
            {sessions?.map((session) => (
              <Menu.Item key={session.id}>
                <Definition.List>
                  <Definition label="Created at">
                    {new Date(session.createdAt).toLocaleString()}
                  </Definition>
                  <Definition
                    label={session.expired ? "Expired at" : "Expires at"}
                  >
                    {new Date(session.expiresAt).toLocaleString()}
                  </Definition>
                  <Definition label="Browser">
                    {getFormattedUserAgent(session.userAgent)}
                  </Definition>
                  <Definition label="Location">
                    <Geolocation ip={session.remoteAddr} />
                  </Definition>
                </Definition.List>
              </Menu.Item>
            ))}
          </Menu>
        )}
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
            Change e-mail <CircleCheckBig />
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
            Change password <CircleCheckBig />
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

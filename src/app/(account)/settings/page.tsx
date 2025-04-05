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
import { client } from "@/lib/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheckBig } from "lucide-react";
import { FormEvent } from "react";
import { UAParser } from "ua-parser-js";

function getFormattedUserAgent(userAgent: string) {
  const { browser, os } = UAParser(userAgent);
  return `${browser.name} ${browser.major} on ${os.name}`;
}

function Sessions() {
  const queryClient = useQueryClient();
  const session = useSession();

  const query = useQuery({
    queryKey: client.users.sessions.queryKey(session.userId),
    queryFn: () => client.users.sessions.get(session.userId),
  });

  const mutation = useMutation({
    mutationFn: (sessionId: number) => client.sessions.delete(sessionId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.users.sessions.queryKey(session.userId),
      });
      query.refetch();
    },
  });

  const sessions = query.data?.payload.data;

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Sessions</h2>
        </Heading>
        <p>
          Check out your session history and invalidate your active sessions.
        </p>
      </header>

      <Alert type="negative" dump={mutation.error} />

      <Alert type="positive" dump={mutation.data} />

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
                  <Geolocation ip={session.ip} />
                </Definition>
              </Definition.List>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </section>
  );
}

function ChangeEmail() {
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
    <form
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      aria-busy={isPending}
    >
      <header className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Change your e-mail</h2>
        </Heading>
        <p>
          Type your new e-mail in the input below and confirm. You&apos;ll
          receive an additional e-mail verification message in your inbox.
        </p>
      </header>

      {error ? <Alert type="negative" dump={error} /> : null}

      {data ? <Alert type="positive" dump={data} /> : null}

      <Field name="email" className="grow">
        <Input type="email" required placeholder="e.g. me@example.com" />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={isPending}>
          Change e-mail <CircleCheckBig />
        </Button>
      </footer>
    </form>
  );
}

function ChangePassword() {
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
    <form
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      aria-busy={isPending}
    >
      <header className="flex flex-col gap-1.5">
        <Heading variant="small" asChild>
          <h2>Change your password</h2>
        </Heading>
        <p>Type your new password in the input below and confirm.</p>
      </header>

      {error ? <Alert type="negative" dump={error} /> : null}

      {data ? <Alert type="positive" dump={data} /> : null}

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
  );
}

export default function Page() {
  return (
    <main className="flex flex-col gap-12">
      <header>
        <Heading asChild>
          <h1>Settings</h1>
        </Heading>
      </header>

      <Sessions />

      <ChangeEmail />

      <ChangePassword />
    </main>
  );
}

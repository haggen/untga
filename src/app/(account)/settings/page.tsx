"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Geolocation } from "@/components/Geolocation";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { Menu } from "@/components/Menu";
import { useSession } from "@/components/SessionProvider";
import { client } from "@/lib/client";
import { format } from "@/lib/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UAParser } from "ua-parser-js";

// @todo: Move this to ./src/lib/something.
function getFormattedUserAgent(userAgent: string) {
  const { browser, os } = UAParser(userAgent);

  if (!browser.name) {
    return "unknown browser";
  }

  return `${browser.name} ${browser.major} (${os.name})`;
}

function Sessions() {
  const queryClient = useQueryClient();
  const session = useSession();
  const router = useRouter();

  const query = useQuery({
    queryKey: client.users.sessions.queryKey(session.userId),
    queryFn: () => client.users.sessions.get(session.userId),
  });

  const mutation = useMutation({
    mutationFn: (sessionId: number) => client.sessions.delete(sessionId),
    onSuccess: async (_, sessionId) => {
      if (session.id === sessionId) {
        queryClient.clear();
        router.push("/register");
      } else {
        await queryClient.invalidateQueries({
          queryKey: client.users.sessions.queryKey(session.userId),
        });
        await query.refetch();
      }
    },
  });

  const sessions = query.data?.payload;

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
              <div className="flex items-center justify-between gap-6 p-3">
                <p>
                  Created at{" "}
                  {format.datetime(session.createdAt, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  , from <Geolocation ip={session.ip} />, on{" "}
                  {getFormattedUserAgent(session.userAgent)}.{" "}
                  {session.expired ? "Expired" : "Expires"} on{" "}
                  {format.datetime(session.expiresAt, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  .
                </p>
                <aside>
                  {session.expired ? null : (
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={() => mutation.mutate(session.id)}
                    >
                      Invalidate
                    </Button>
                  )}
                </aside>
              </div>
            </Menu.Item>
          ))}
        </Menu>
      )}
    </section>
  );
}

function ChangeEmail() {
  const session = useSession();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      client.users.patch(session.userId, payload),
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

      <Alert type="negative" dump={error} />

      <Alert type="positive" dump={data} />

      <Field name="email">
        <Input type="email" required placeholder="e.g. player@example.com" />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={isPending}>
          Change my e-mail
        </Button>
      </footer>
    </form>
  );
}

function ChangePassword() {
  const session = useSession();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      client.users.patch(session.userId, payload),
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

      <Alert type="negative" dump={error} />

      <Alert type="positive" dump={data} />

      <Field name="password" hint="At least 12 characters.">
        <Input
          type="password"
          required
          minLength={12}
          placeholder="e.g. super-secret-phrase"
        />
      </Field>

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={isPending}>
          Change my password
        </Button>
      </footer>
    </form>
  );
}

function DeleteAccount() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const session = useSession();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: () => client.users.delete(session.userId),
    onSuccess: () => {
      queryClient.clear();
      router.push("/register");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      aria-busy={isPending}
    >
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

      <Alert type="negative" dump={error} />

      <Alert type="positive" dump={data} />

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={isPending}>
          Delete my account
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
      <DeleteAccount />
    </main>
  );
}

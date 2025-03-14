"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Group } from "@/components/Group";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { client } from "@/lib/client";
import { Session } from "@/lib/db";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Page() {
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ["sessions"],
    mutationFn: (payload: FormData) =>
      client.request<{ data: Session }>("/api/sessions", {
        payload,
      }),
    onSuccess: () => {
      router.push("/characters");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutate(payload);
  };

  return (
    <Group level={2} asChild>
      <main>
        <Group level={4} asChild>
          <header>
            <Heading asChild>
              <h1>Sign in</h1>
            </Heading>

            <p>
              Welcome back, adventurer! Before you can resume your journey,
              first you need to start a new session.
            </p>
          </header>
        </Group>

        <Group level={3} asChild>
          <form onSubmit={onSubmit} aria-busy={isPending}>
            {error ? (
              <Alert type="negative">{JSON.stringify(error)}</Alert>
            ) : null}

            {data ? (
              <Alert type="positive">{JSON.stringify(data)}</Alert>
            ) : null}

            <Group level={4} asChild>
              <fieldset>
                <Field name="email" label="E-mail">
                  <Input
                    type="email"
                    required
                    placeholder="e.g. me@example.com"
                  />
                </Field>

                <Field name="password" label="Password">
                  <Input
                    type="password"
                    required
                    minLength={12}
                    placeholder="e.g. super-secret-phrase"
                  />
                </Field>
              </fieldset>
            </Group>

            <footer className="flex justify-end">
              <Button type="submit" disabled={isPending}>
                Sign in
                <LogIn />
              </Button>
            </footer>
          </form>
        </Group>
      </main>
    </Group>
  );
}

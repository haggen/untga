"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Group } from "@/components/Group";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { ClipboardPenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Page() {
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ["users"],
    mutationFn: (payload: FormData) =>
      client.request("/api/users", {
        payload,
      }),
    onSuccess: () => {
      router.push("/characters/create");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);
    mutate(payload);
  };

  return (
    <Group level={2} asChild>
      <main>
        <Group level={4} asChild>
          <header>
            <Heading asChild>
              <h1>Registration</h1>
            </Heading>

            <p>
              Welcome, adventurer! Before you can start playing, first you need
              to create an account.
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
                    autoComplete="username"
                    required
                    placeholder="e.g. me@example.com"
                  />
                </Field>

                <Field
                  name="password"
                  label="Password"
                  hint="At least 12 characters."
                >
                  <Input
                    type="password"
                    autoComplete="password"
                    required
                    minLength={12}
                    placeholder="e.g. super-secret-phrase"
                  />
                </Field>
              </fieldset>
            </Group>

            <footer className="flex justify-end">
              <Button type="submit" size="default" disabled={isPending}>
                Register
                <ClipboardPenLine />
              </Button>
            </footer>
          </form>
        </Group>
      </main>
    </Group>
  );
}

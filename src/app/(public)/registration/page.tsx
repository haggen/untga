"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Heading } from "~/components/simple/Heading";
import { Input } from "~/components/simple/Input";
import { client } from "~/lib/client";

export default function Page() {
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) => client.users.post(payload),
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
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading as="h1">Registration</Heading>

        <p>
          Welcome, adventurer! Before you can start playing, you&apos;ll need to
          create an account.
        </p>
      </header>

      <form
        className="flex flex-col gap-9"
        onSubmit={onSubmit}
        aria-busy={isPending}
      >
        <Alert type="negative" dump={error} />

        <Alert type="positive" dump={data} />

        <fieldset className="flex flex-col gap-6">
          <Field
            name="email"
            label="E-mail"
            hint="For communication and account recovery."
          >
            <Input
              type="email"
              autoComplete="username"
              required
              placeholder="e.g. player@example.com"
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

        <footer className="flex justify-end">
          <Button type="submit" size="default" disabled={isPending}>
            Register
          </Button>
        </footer>
      </form>
    </main>
  );
}

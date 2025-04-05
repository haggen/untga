"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Page() {
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) => client.sessions.post(payload),
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
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <Heading asChild>
          <h1>Log in</h1>
        </Heading>

        <p>
          Welcome back, adventurer! Before you can resume your journey,
          you&apos;ll need to start a new session.
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
          <Field name="email" label="E-mail">
            <Input
              type="email"
              required
              placeholder="e.g. player@example.com"
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

        <footer className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Log in
          </Button>
        </footer>
      </form>
    </main>
  );
}

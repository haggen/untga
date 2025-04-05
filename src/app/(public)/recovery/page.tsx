"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { client } from "@/lib/client";
import { Session } from "@/lib/db";
import { useMutation } from "@tanstack/react-query";
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
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <Heading asChild>
          <h1>Recovery</h1>
        </Heading>

        <p>
          Don&apos;t worry, adventurer! We can help you recover your account.
          Type in the e-mail you used to register and we&apos;ll send you a link
          to reset your password.
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
          <Field name="email" label="Registration e-mail">
            <Input
              type="email"
              required
              placeholder="e.g. player@example.com"
            />
          </Field>
        </fieldset>

        <footer className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            Recover account
          </Button>
        </footer>
      </form>
    </main>
  );
}

"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
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
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutate(payload);
  };

  return (
    <Stack gap={10} asChild>
      <main>
        <Stack gap={4} asChild>
          <header>
            <Heading asChild>
              <h1>Registration</h1>
            </Heading>

            <p>
              Welcome, weary traveller! Before you can start playing, first you
              need to create an account.
            </p>
          </header>
        </Stack>

        <Stack gap={10} asChild>
          <form onSubmit={onSubmit} aria-busy={isPending}>
            {error ? (
              <Alert type="negative">{JSON.stringify(error)}</Alert>
            ) : null}

            {data ? (
              <Alert type="positive">{JSON.stringify(data)}</Alert>
            ) : null}

            <Stack gap={4} asChild>
              <fieldset>
                <Field name="name" label="Name">
                  <Input type="text" required />
                </Field>
              </fieldset>
            </Stack>

            <footer>
              <Button type="submit" size="default" disabled={isPending}>
                Create character
              </Button>
            </footer>
          </form>
        </Stack>
      </main>
    </Stack>
  );
}

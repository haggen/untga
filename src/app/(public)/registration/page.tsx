"use client";

import { Header } from "@/app/(public)/header";
import { Alert } from "@/components/Alert";
import { Anchor } from "@/components/Anchor";
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
      <div>
        <Header>
          <ul className="flex items-center gap-6">
            <li>
              <Anchor href="/sign-in">Sign in</Anchor>
            </li>
          </ul>
        </Header>

        <Stack gap={10} asChild>
          <main>
            <Stack gap={4} asChild>
              <header>
                <Heading asChild>
                  <h1>Registration</h1>
                </Heading>

                <p>
                  Welcome, weary traveller! Before you can start playing, first
                  you need to create an account.
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
                    <Field name="email" label="E-mail">
                      <Input type="email" autoComplete="username" required />
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
                      />
                    </Field>
                  </fieldset>
                </Stack>

                <footer>
                  <Button type="submit" size="default" disabled={isPending}>
                    Register
                  </Button>
                </footer>
              </form>
            </Stack>
          </main>
        </Stack>
      </div>
    </Stack>
  );
}

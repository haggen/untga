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
import { Session } from "@/lib/prisma";
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
    <Stack gap={10} asChild>
      <div>
        <Header>
          <ul className="flex items-center gap-6">
            <li>
              <Anchor href="/registration">Register</Anchor>
            </li>
          </ul>
        </Header>

        <Stack gap={10} asChild>
          <main>
            <Stack gap={4} asChild>
              <header>
                <Heading asChild>
                  <h1>Sign in</h1>
                </Heading>

                <p>
                  Welcome back, adventurer! Before you can resume your journey,
                  first you need to start a new session.
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
                </Stack>

                <footer className="flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    Sign in
                    <LogIn />
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

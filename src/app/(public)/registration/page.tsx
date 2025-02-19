"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
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
    <Stack level={1}>
      <nav className="flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold">Untga</h1>
        </Link>

        <ul className="flex items-center gap-3">
          <li>
            <Link href="/">Sign-in</Link>
          </li>
        </ul>
      </nav>

      <hr className="border-stone-300" />

      <Stack level={1} asChild>
        <main>
          <Stack level={3} asChild>
            <header>
              <Heading asChild>
                <h1>Registration</h1>
              </Heading>

              <p>
                Welcome! Before you can start playing, first you need to create
                an account.
              </p>
            </header>
          </Stack>

          <Stack level={2} asChild>
            <form onSubmit={onSubmit} aria-busy={isPending}>
              {error ? (
                <Alert type="negative">{JSON.stringify(error)}</Alert>
              ) : null}

              {data ? (
                <Alert type="positive">{JSON.stringify(data)}</Alert>
              ) : null}

              <Stack level={3} asChild>
                <fieldset>
                  <Field name="email" label="E-mail">
                    <Input type="email" required />
                  </Field>

                  <Field
                    name="password"
                    label="Password"
                    hint="At least 12 characters."
                  >
                    <Input type="password" required minLength={12} />
                  </Field>
                </fieldset>
              </Stack>

              <footer>
                <Button type="submit" disabled={isPending}>
                  Register
                </Button>
              </footer>
            </form>
          </Stack>
        </main>
      </Stack>
    </Stack>
  );
}

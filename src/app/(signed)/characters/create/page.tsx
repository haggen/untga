"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Page() {
  const session = useSession();
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationKey: ["users", session.userId, "characters"],
    mutationFn: (payload: FormData) =>
      client.request(`/api/users/${session.userId}/characters`, {
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
      <main>
        <Stack gap={4} asChild>
          <header>
            <Heading asChild>
              <h1>Create new character</h1>
            </Heading>

            <p>
              Choose your character&apos;s name below. This is how you&apos;ll
              be known in this world.
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
                  <Input type="text" required placeholder="e.g. Sigsmund III" />
                </Field>
              </fieldset>
            </Stack>

            <footer className="flex items-center gap-4">
              <Button type="submit" size="default" disabled={isPending}>
                Create
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/characters">Cancel</Link>
              </Button>
            </footer>
          </form>
        </Stack>
      </main>
    </Stack>
  );
}

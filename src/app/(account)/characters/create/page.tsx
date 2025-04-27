"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";
import { useSession } from "~/components/SessionProvider";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Heading } from "~/components/simple/Heading";
import { Input } from "~/components/simple/Input";
import { Textarea } from "~/components/simple/Textarea";
import { client } from "~/lib/client";
import { draw } from "~/lib/random";
import { character } from "~/static/name";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) => client.characters.post(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.characters.queryKey(),
      });
      router.push("/characters");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);
    payload.set("userId", String(session.userId));

    mutate(payload);
  };

  const typeRandomName = () => {
    if (inputRef.current) {
      inputRef.current.value = draw(character);
    }
  };

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading as="h1" variant="large">
          New character
        </Heading>
        <p>
          Enter your character&apos;s details below. This is how you&apos;ll be
          known in this world.
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
            name="name"
            label="Name"
            hint="You won't be able to change this later."
          >
            <Input
              ref={inputRef}
              type="text"
              required
              placeholder="e.g. Ragnar"
              pattern="[a-zA-Z0-9\s]+"
            />
            <Button type="button" variant="secondary" onClick={typeRandomName}>
              <Dices />
            </Button>
          </Field>

          <Field
            name="description"
            label="Bio"
            hint="This information is public and you can change it later. Limit of 256 characters."
          >
            <Textarea
              rows={4}
              maxLength={256}
              placeholder="e.g. The child of a blacksmith..."
            />
          </Field>
        </fieldset>

        <footer className="flex items-center justify-end gap-2">
          <Button type="submit" size="default" disabled={isPending}>
            Create character
          </Button>
        </footer>
      </form>
    </main>
  );
}

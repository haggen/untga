"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { useSession } from "@/components/SessionProvider";
import { Textarea } from "@/components/Textarea";
import { client } from "@/lib/client";
import { draw } from "@/lib/random";
import { characters } from "@/static/names";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dices } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: (payload: FormData) => client.characters.post(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.users.characters.queryKey(session.userId),
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
      inputRef.current.value = draw(characters);
    }
  };

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading asChild>
          <h1>New character</h1>
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
            hint="Your bio is public you can change it later."
          >
            <Textarea
              rows={3}
              required
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

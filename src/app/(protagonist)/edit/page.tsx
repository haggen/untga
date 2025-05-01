"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, use } from "react";
import { useSession } from "~/components/SessionProvider";
import { Alert } from "~/components/simple/Alert";
import { Button } from "~/components/simple/Button";
import { Field } from "~/components/simple/Field";
import { Heading } from "~/components/simple/Heading";
import { Input } from "~/components/simple/Input";
import { Textarea } from "~/components/simple/Textarea";
import { client } from "~/lib/client";
import { parse, schemas } from "~/lib/validation";

function DeleteForm({ characterId }: { characterId: number }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, data, error, isPending } = useMutation({
    mutationFn: () => client.characters.delete(characterId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.characters.queryKey(),
      });
      router.push("/characters");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      aria-busy={isPending}
    >
      <header className="flex flex-col gap-1.5">
        <Heading size="small" asChild>
          <h2>Delete your character</h2>
        </Heading>
        <p>
          By clicking on the button below you agree to have this
          character&apos;s data and progression be irrevocably purged from our
          system.
        </p>
      </header>

      <Alert type="negative" dump={error} />

      <Alert type="positive" dump={data} />

      <footer className="flex justify-end">
        <Button type="submit" size="default" disabled={isPending}>
          Delete this character
        </Button>
      </footer>
    </form>
  );
}

type Props = {
  params: Promise<{ characterId: string }>;
};

export default function Page({ params }: Props) {
  const session = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { characterId } = parse(use(params), {
    characterId: schemas.id,
  });

  const query = useQuery({
    queryKey: client.characters.queryKey(session.userId),
    queryFn: () => client.characters.get(characterId),
  });

  const character = query.data?.payload;

  const mutation = useMutation({
    mutationFn: (payload: FormData) =>
      client.characters.patch(characterId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: client.characters.queryKey(session.userId),
      });
      router.push(`/characters/${characterId}`);
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = new FormData(form);

    mutation.mutate(payload);
  };

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>Edit character</h1>
        </Heading>
        <p>
          You can change some of your character&apos;s details below. This is
          how you&apos;re known in the world.
        </p>
      </header>

      <form
        className="flex flex-col gap-9"
        onSubmit={onSubmit}
        aria-busy={mutation.isPending}
      >
        <Alert type="negative" dump={mutation.error} />

        <Alert type="positive" dump={mutation.data} />

        <fieldset className="flex flex-col gap-6">
          <Field label="Name" hint="You can't change the character's name.">
            <Input type="text" disabled value={character?.name ?? ""} />
          </Field>

          <Field
            name="description"
            label="Bio"
            hint="This information is public. Limit of 256 characters."
          >
            <Textarea
              rows={4}
              maxLength={256}
              placeholder="e.g. The child of a blacksmith..."
              defaultValue={character?.description ?? ""}
            />
          </Field>
        </fieldset>

        <footer className="flex items-center justify-end gap-2">
          <Button type="submit" size="default" disabled={mutation.isPending}>
            Update character
          </Button>
        </footer>
      </form>

      <DeleteForm characterId={characterId} />
    </main>
  );
}

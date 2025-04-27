"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "~/components/SessionProvider";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { Character, client } from "~/lib/client";

function CharacterSlot({
  loading,
  character,
}: {
  loading: boolean;
  character: Character | undefined | null;
}) {
  return (
    <Menu.Item
      href={
        loading
          ? undefined
          : character
          ? `/characters/${character.id}`
          : "/characters/create"
      }
    >
      {loading
        ? "Loading..."
        : character?.name ?? (
            <span className="text-stone-600">Empty (create new character)</span>
          )}
    </Menu.Item>
  );
}

export default function Page() {
  const session = useSession();

  const { data, isFetching } = useQuery({
    queryKey: client.characters.queryKey(),
    queryFn: () => client.users.characters.get(session.userId),
  });

  const characters = data?.payload ?? [];

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading as="h1">Characters</Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

      <Menu.Menu>
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <CharacterSlot
              key={i}
              loading={isFetching}
              character={characters[i]}
            />
          ))}
      </Menu.Menu>
    </main>
  );
}

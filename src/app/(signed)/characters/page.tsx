"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { type Character } from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function List({ characters }: { characters: Character[] }) {
  return (
    <Stack gap={4} asChild>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link href={`/characters/${character.id}`}>{character.name}</Link>
          </li>
        ))}
      </ul>
    </Stack>
  );
}

export default function Page() {
  const session = useSession();

  const { data, isFetching } = useQuery({
    queryKey: ["characters"],
    queryFn: () =>
      client.request<{ data: Character[] }>(
        `/api/users/${session.userId}/characters`
      ),
  });

  return (
    <Stack gap={10} asChild>
      <main>
        <Stack gap={4} asChild>
          <header>
            <Heading asChild>
              <h1>Characters</h1>
            </Heading>

            <p>Select the character with which you&apos;d like to play.</p>
          </header>
        </Stack>

        {isFetching ? (
          <p>Loading...</p>
        ) : data?.payload.data.length ? (
          <List characters={data.payload.data} />
        ) : (
          <Alert type="neutral">
            <p>You don&apos;t have any characters.</p>
          </Alert>
        )}

        <footer>
          <Button asChild>
            <Link href="/characters/create">Create new character</Link>
          </Button>
        </footer>
      </main>
    </Stack>
  );
}

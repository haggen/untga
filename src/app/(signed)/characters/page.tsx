"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { type Character } from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";
import { UserIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

function List({
  characters,
}: {
  characters: Character<{ include: { location: true } }>[];
}) {
  return (
    <ul className="shadow ring ring-current/10">
      {characters.map((character) => (
        <li
          key={character.id}
          className="bg-orange-100/33 hover:bg-orange-200/50 not-first:border-t border-current/50"
        >
          <Link
            href={`/characters/${character.id}`}
            className="flex gap-1 p-3 font-bold"
          >
            <UserIcon />
            {character.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  const session = useSession();

  const { data, isFetching } = useQuery({
    queryKey: ["characters"],
    queryFn: () =>
      client.request<{ data: Character<{ include: { location: true } }>[] }>(
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
          <Alert type="neutral">
            <p>Loading...</p>
          </Alert>
        ) : data?.payload.data.length ? (
          <List characters={data.payload.data} />
        ) : (
          <Alert type="neutral">
            <p>You don&apos;t have any characters.</p>
          </Alert>
        )}

        <footer className="flex justify-end">
          <Button asChild>
            <Link href="/characters/create">
              New character
              <UserPlusIcon />
            </Link>
          </Button>
        </footer>
      </main>
    </Stack>
  );
}

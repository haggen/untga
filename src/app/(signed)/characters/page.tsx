"use client";

import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Heading } from "@/components/Heading";
import { Menu } from "@/components/Menu";
import { useSession } from "@/components/SessionProvider";
import { Stack } from "@/components/Stack";
import { client } from "@/lib/client";
import { type Character } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { UserIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
  const session = useSession();

  const { data, isFetching } = useQuery({
    queryKey: ["users", session.userId, "characters"],
    queryFn: () =>
      client.request<{ data: Character<{ include: { location: true } }>[] }>(
        `/api/users/${session.userId}/characters`
      ),
  });

  const characters = data?.payload.data;

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
        ) : characters?.length ? (
          <Menu>
            {characters.map((character) => (
              <li key={character.id}>
                <Menu.Item asChild className="flex items-center gap-1">
                  <Link href={`/characters/${character.id}`}>
                    <UserIcon />
                    {character.name}
                  </Link>
                </Menu.Item>
              </li>
            ))}
          </Menu>
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

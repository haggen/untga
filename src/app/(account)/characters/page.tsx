"use client";

import { Alert } from "@/components/Alert";
import { Heading } from "@/components/Heading";
import { Menu } from "@/components/Menu";
import { useSession } from "@/components/SessionProvider";
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

  const characters = data?.payload.data ?? [];

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading asChild>
          <h1>Characters</h1>
        </Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

      {isFetching ? (
        <Alert type="neutral">
          <p>Loading...</p>
        </Alert>
      ) : null}

      <Menu>
        {characters.map((character) => (
          <Menu.Item
            key={character.id}
            asChild
            className="flex items-center gap-1"
          >
            <Link href={`/characters/${character.id}`}>
              <UserIcon />
              {character.name}
            </Link>
          </Menu.Item>
        ))}
        <Menu.Item
          asChild
          className="flex items-center justify-center gap-1 font-bold"
        >
          <Link href="/characters/create">
            Create new character
            <UserPlusIcon />
          </Link>
        </Menu.Item>
      </Menu>
    </main>
  );
}

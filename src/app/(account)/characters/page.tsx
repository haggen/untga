"use client";

import { useQuery } from "@tanstack/react-query";
import { Heading } from "~/components/Heading";
import { Menu } from "~/components/Menu";
import { useSession } from "~/components/SessionProvider";
import { client } from "~/lib/client";

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
        <Heading asChild>
          <h1>Characters</h1>
        </Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

      <Menu>
        <Menu.Item
          href={
            isFetching
              ? undefined
              : characters[0]
              ? `/characters/${characters[0].id}`
              : "/characters/create"
          }
        >
          <div className="flex items-center h-12 p-3">
            {isFetching
              ? "Loading..."
              : characters[0]?.name ?? "Empty (create new character)"}
          </div>
        </Menu.Item>
        <Menu.Item
          href={
            isFetching
              ? undefined
              : characters[1]
              ? `/characters/${characters[1].id}`
              : "/characters/create"
          }
        >
          <div className="flex items-center h-12 p-3">
            {isFetching
              ? "Loading..."
              : characters[1]?.name ?? "Empty (create new character)"}
          </div>
        </Menu.Item>
        <Menu.Item
          href={
            isFetching
              ? undefined
              : characters[2]
              ? `/characters/${characters[2].id}`
              : "/characters/create"
          }
        >
          <div className="flex items-center h-12 p-3">
            {isFetching
              ? "Loading..."
              : characters[2]?.name ?? "Empty (create new character)"}
          </div>
        </Menu.Item>
      </Menu>
    </main>
  );
}

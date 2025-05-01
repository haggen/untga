import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";

export default async function Page() {
  const session = await ensureActiveSession(true);

  const characters = await db.character.findMany({
    where: {
      user: { id: session.user.id },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const slots = Array(5)
    .fill(undefined)
    .map((_, i) => characters[i]);

  return (
    <main className="flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading as="h1">Characters</Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

      <Menu.List>
        {slots.map((character, i) => (
          <Menu.Item
            key={i}
            href={
              character ? `/characters/${character.id}` : "/characters/create"
            }
          >
            {character?.name ?? (
              <span className="text-neutral-600">
                Empty (create new character)
              </span>
            )}
          </Menu.Item>
        ))}
      </Menu.List>
    </main>
  );
}

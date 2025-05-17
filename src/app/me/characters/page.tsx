import { Metadata } from "next";
import { Heading } from "~/components/heading";
import * as Menu from "~/components/menu";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";

export const metadata: Metadata = {
  title: "Characters at Untga",
};

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
    <div className="grow flex flex-col">
      <header className="flex flex-col gap-2 p-section">
        <Heading size="large" asChild>
          <h1>Characters</h1>
        </Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

      <div className="p-section">
        <Menu.List>
          {slots.map((character, i) => (
            <Menu.Item
              key={i}
              href={
                character
                  ? `/play/${character.id}/stats`
                  : "/me/characters/create"
              }
            >
              {character?.name ?? (
                <span className="text-foreground-placeholder">
                  Empty (create new character)
                </span>
              )}
            </Menu.Item>
          ))}
        </Menu.List>
      </div>
    </div>
  );
}

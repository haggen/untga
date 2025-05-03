import { Metadata, ResolvingMetadata } from "next";
import { Heading } from "~/components/Heading";
import * as Menu from "~/components/Menu";
import { db } from "~/lib/db";
import { ensureActiveSession } from "~/lib/session";

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { title } = await parent;

  return { title: `Characters at ${title}` };
}

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
    <div className="grow flex flex-col gap-12">
      <header className="flex flex-col gap-1.5">
        <Heading size="large" asChild>
          <h1>Characters</h1>
        </Heading>
        <p>Select the character with whom you&apos;d like to play.</p>
      </header>

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
              <span className="text-neutral-600">
                Empty (create new character)
              </span>
            )}
          </Menu.Item>
        ))}
      </Menu.List>
    </div>
  );
}

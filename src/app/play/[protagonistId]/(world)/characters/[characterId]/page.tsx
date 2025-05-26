import { Metadata } from "next";
import { Back } from "~/components/back";
import * as Definition from "~/components/definition";
import { Heading } from "~/components/heading";
import * as Menu from "~/components/menu";
import { db } from "~/lib/db";
import { fmt } from "~/lib/fmt";
import { parse, schemas } from "~/lib/validation";

export async function generateMetadata({
  params,
}: {
  params: Promise<unknown>;
}): Promise<Metadata> {
  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  const character = await db.character.findUniqueOrThrow({
    where: { id: characterId },
    select: { name: true },
  });

  return { title: character.name };
}

function Actions({
  characterId,
  protagonistId,
}: {
  characterId: number;
  protagonistId: number;
}) {
  if (characterId === protagonistId) {
    return (
      <Menu.List>
        <Menu.Item href={`/play/${characterId}/edit`}>Edit</Menu.Item>
        <Menu.Item href="/account/characters">Log off</Menu.Item>
        <Back asChild>
          <Menu.Item href="#">Cancel</Menu.Item>
        </Back>
      </Menu.List>
    );
  }

  return null;
}

export default async function Page({ params }: { params: Promise<unknown> }) {
  const { characterId, protagonistId } = parse(await params, {
    protagonistId: schemas.id,
    characterId: schemas.id,
  });

  const character = await db.character.findUniqueOrThrow({
    where: { id: characterId },
    include: {
      location: true,
    },
  });

  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-2 p-section">
        <Heading size="large" asChild className="truncate">
          <h1>{character.name}</h1>
        </Heading>

        <p>{character.description || "No description available."}</p>

        <Definition.List>
          <Definition.Item label="Birth">
            {fmt.datetime(character.createdAt, {
              dateStyle: "short",
            })}
          </Definition.Item>
          <Definition.Item label="Location">
            {character.location.name}
          </Definition.Item>
          <Definition.Item label="Status">
            {fmt.string(character.status, { title: true })}
          </Definition.Item>
        </Definition.List>
      </header>

      <div className="p-section">
        <Actions characterId={characterId} protagonistId={protagonistId} />
      </div>
    </div>
  );
}

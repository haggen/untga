import Image from "next/image";
import { Heading } from "~/components/simple/Heading";
import * as Menu from "~/components/simple/Menu";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

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
        <Menu.Item href="/me/characters">Switch</Menu.Item>
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
  });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-1.5">
        <Image
          src="/silhouette.png"
          alt="Nondescript silhouette of a person."
          width={702}
          height={702}
          className="w-full mix-blend-color-burn"
        />

        <Heading size="large" asChild className="truncate">
          <h1>{character.name}</h1>
        </Heading>

        <p>{character.description || "No description available."}</p>
      </div>

      <Actions characterId={characterId} protagonistId={protagonistId} />
    </div>
  );
}

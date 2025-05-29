import { Metadata } from "next";
import { Fragment } from "react";
import { Back } from "~/components/back";
import { Summary } from "~/components/character/summary";
import { Heading } from "~/components/heading";
import * as Menu from "~/components/menu";
import { db } from "~/lib/db";
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

        <Summary character={character} />
      </header>

      <div className="p-section">
        <Menu.List>
          {protagonistId === characterId ? (
            <Fragment>
              <Menu.Item href={`/account/characters/${characterId}/edit`}>
                Edit
              </Menu.Item>
              <Menu.Item href="/account/characters">Log off</Menu.Item>
            </Fragment>
          ) : null}
          <Back asChild>
            <Menu.Item href="#">Cancel</Menu.Item>
          </Back>
        </Menu.List>
      </div>
    </div>
  );
}

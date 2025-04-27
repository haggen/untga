import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";
import { tag } from "~/static/tag";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const character = await db.character.findUnique({
    where: {
      id: characterId,
    },
  });

  if (!character) {
    throw new NotFoundError("Character not found.");
  }

  const location = await db.location.findFirstOrThrow({
    where: {
      characters: { some: { id: characterId } },
    },
    include: {
      characters: true,
      routes: true,
      destinations: true,
    },
  });

  return { payload: location };
});

export const PUT = createApiHandler(async ({ params, payload }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const data = parse(payload, {
    locationId: schemas.id,
  });

  const character = await db.character.findUnique({
    where: {
      id: characterId,
    },
    include: {
      location: true,
    },
  });

  if (!character) {
    throw new NotFoundError("Character not found.");
  }

  const location = await db.location.findUnique({
    where: {
      id: data.locationId,
    },
  });

  if (!location) {
    throw new NotFoundError("Location not found.");
  }

  if (!character.tags.includes(tag.Idle)) {
    throw new Error("Character is busy and can't travel right now.");
  }

  await db.character.update({
    where: {
      id: characterId,
    },
    data: {
      // tags: {
      //   set: replace(character.tags, [tag.Idle], [tag.Travelling]),
      // },
      location: {
        connect: { id: data.locationId },
      },
      logs: {
        create: {
          message: `I have travelled from ${character.location.name} to ${location.name}.`,
        },
      },
    },
  });

  return { payload: undefined, status: 204 };
});

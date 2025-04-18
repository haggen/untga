import { z } from "zod";
import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const character = await db.character.findUnique({
    where: { id: characterId },
  });

  if (!character) {
    throw new NotFoundError();
  }

  return { payload: character };
});

export const PATCH = createApiHandler(async ({ params, payload, session }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const { description } = parse(payload, {
    description: z.string().max(256).optional(),
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  let character = await db.character.findUnique({
    where: {
      id: characterId,
    },
  });

  if (!character) {
    throw new NotFoundError("Character not found.");
  }

  if (character.userId !== session.userId) {
    throw new UnauthorizedError("You can't edit this character.");
  }

  character = await db.character.update({
    where: { id: characterId },
    data: { description },
  });

  return { payload: character };
});

export const DELETE = createApiHandler(async ({ params, session }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  const character = await db.character.findUnique({
    where: {
      id: characterId,
    },
  });

  if (!character) {
    throw new NotFoundError("Character not found.");
  }

  if (character.userId !== session.userId) {
    throw new UnauthorizedError("You can't delete this character.");
  }

  await db.character.update({
    where: { id: characterId },
    data: { deletedAt: new Date() },
  });

  return { payload: character };
});

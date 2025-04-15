import { NextResponse } from "next/server";
import { z } from "zod";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { getBody } from "~/lib/request";
import { requireActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const character = await db.character.findUnique({
    where: { id: characterId },

    include: {
      location: true,
      effects: { include: { spec: true } },
      attributes: { include: { spec: true } },
      slots: { include: { items: { include: { spec: true } } } },
    },
  });

  if (!character) {
    throw new NotFoundError();
  }

  return NextResponse.json(character);
});

export const PATCH = withPipeline(
  withErrorHandling(),
  async ({ params, request }) => {
    const { characterId } = parse(params, {
      characterId: schemas.id,
    });

    const { description } = parse(await getBody(request), {
      description: z.string().max(256).optional(),
    });

    const session = await requireActiveSession();

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

    return NextResponse.json(character);
  }
);

export const DELETE = withPipeline(withErrorHandling(), async ({ params }) => {
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

  const session = await requireActiveSession();

  if (character.userId !== session.userId) {
    throw new UnauthorizedError();
  }

  await db.user.update({
    where: { id: characterId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(character);
});

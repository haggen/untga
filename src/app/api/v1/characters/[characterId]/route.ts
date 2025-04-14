import { NextResponse } from "next/server";
import { z } from "zod";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { getBody } from "~/lib/request";
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

    const character = await db.character.update({
      where: { id: characterId },
      data: { description },
    });

    return NextResponse.json(character);
  }
);

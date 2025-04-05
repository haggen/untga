import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { withErrorHandling, withMiddleware } from "@/lib/middleware";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async (context) => {
  const { params } = context;
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

  return NextResponse.json({ data: character });
});

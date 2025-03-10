import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { userId: string; characterId: string };

/**
 * Get a private detailed profile of a user's character.
 */
export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId, characterId } = parse(await params, {
      userId: schemas.id,
      characterId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    const character = await db.character.findUnique({
      where: { id: characterId, userId },
      include: {
        location: true,
        attributes: { include: { spec: true } },
        resources: { include: { spec: true } },
        slots: { include: { item: { include: { spec: true } } } },
      },
    });

    if (!character) {
      throw new NotFoundError();
    }

    if (userId !== session.userId) {
      throw new UnauthorizedError(
        "Character's detailed profile isn't accessible to you."
      );
    }

    return NextResponse.json({ data: character });
  }
);

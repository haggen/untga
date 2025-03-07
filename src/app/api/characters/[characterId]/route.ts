import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { characterId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    const character = await db.character.findUnique({
      where: { id: characterId },
      include: {
        location: true,
        attributes: { include: { specification: true } },
        container: { include: { items: { include: { specification: true } } } },
      },
    });

    if (!character) {
      throw new NotFoundError();
    }

    if (session.userId !== character.userId) {
      throw new UnauthorizedError();
    }

    return NextResponse.json({ data: character });
  }
);

import { withErrorHandling } from "@/lib/api";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { db } from "@/lib/prisma";
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
    });

    if (!character) {
      throw new NotFoundError("Character was not found.");
    }

    if (character.userId !== session.userId) {
      throw new UnauthorizedError("Character does not belong to you.");
    }

    const where = { container: { character: { id: characterId } } };

    const items = await db.item.findMany({
      where,
      include: { specification: true },
    });

    const total = await db.item.count({ where });

    return NextResponse.json({ data: items, total });
  }
);

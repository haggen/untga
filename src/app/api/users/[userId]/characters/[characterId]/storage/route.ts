import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { userId: string; characterId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId, characterId } = parse(await params, {
      userId: schemas.id,
      characterId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    if (userId !== session.userId) {
      throw new UnauthorizedError(
        "Character's storage isn't accessible to you."
      );
    }

    const character = await db.character.findUnique({
      where: { id: characterId, userId },
      include: {
        slots: {
          where: { type: "storage" },
          include: {
            item: {
              include: {
                spec: true,
                storage: {
                  include: {
                    source: { include: { spec: true } },
                    items: { include: { spec: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundError("Character was not found.");
    }

    return NextResponse.json({ data: character.slots[0].item?.storage });
  }
);

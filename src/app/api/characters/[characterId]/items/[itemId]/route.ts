import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { characterId: string; itemId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId, itemId } = parse(await params, {
      characterId: schemas.id,
      itemId: schemas.id,
    });

    const { userId } = (await getActiveSession()) ?? {};

    const item = await db.item.findUniqueOrThrow({
      where: {
        id: itemId,
        container: {
          character: { id: characterId },
          OR: [{ character: { userId: null } }, { character: { userId } }],
        },
      },
      include: { specification: true },
    });

    return NextResponse.json(item);
  }
);

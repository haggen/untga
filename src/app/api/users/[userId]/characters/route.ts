import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { userId: string };

/**
 * Get all the characters of the authenticated player.
 */
export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId } = parse(await params, {
      userId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    if (session.userId !== userId) {
      throw new UnauthorizedError();
    }

    const characters = await db.character.findMany({
      where: { userId },
      include: {
        location: true,
        attributes: { include: { spec: true } },
        resources: { include: { spec: true } },
        slots: { include: { item: { include: { spec: true } } } },
      },
    });

    const total = await db.character.count({ where: { userId } });

    return NextResponse.json({ data: characters, total });
  }
);

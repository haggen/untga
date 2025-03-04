import { withErrorHandling } from "@/lib/api";
import { UnauthorizedError } from "@/lib/error";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { userId: string };

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
        attributes: { include: { specification: true } },
      },
    });

    const total = await db.character.count({ where: { userId } });

    return NextResponse.json({ data: characters, total });
  }
);

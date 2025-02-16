import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { clearActiveSession, getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { sessionId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { sessionId } = parse(await params, {
      sessionId: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.findUniqueOrThrow({
      where: { id: sessionId, userId },
      omit: {
        secret: true,
      },
    });

    return NextResponse.json(session);
  }
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { sessionId } = parse(await params, {
      sessionId: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.update({
      where: { id: sessionId, userId },
      data: { expiresAt: new Date() },
      omit: {
        secret: true,
      },
    });

    await clearActiveSession();

    return NextResponse.json(session);
  }
);

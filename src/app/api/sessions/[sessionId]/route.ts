import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { clearActiveSession, getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { sessionId: string };

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { sessionId } = parse(await params, {
      sessionId: schemas.id,
    });

    const { userId, id: activeSessionId } = await getActiveSessionOrThrow();

    let session = await db.session.findUnique({
      omit: { secret: true },
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundError();
    }

    if (session.userId !== userId) {
      throw new UnauthorizedError();
    }

    session = await db.session.update({
      omit: { secret: true },
      where: { id: sessionId },
      data: { expiresAt: new Date() },
    });

    if (activeSessionId === sessionId) {
      await clearActiveSession();
    }

    return NextResponse.json({ data: session });
  }
);

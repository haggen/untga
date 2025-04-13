import { NextResponse } from "next/server";
import { withErrorHandling, withMiddleware } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { requireActiveSession, unsetActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const DELETE = withMiddleware(
  withErrorHandling(),
  async ({ params }) => {
    const { sessionId } = parse(params, {
      sessionId: schemas.id,
    });

    const { userId, id: activeSessionId } = await requireActiveSession();

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
      await unsetActiveSession();
    }

    return NextResponse.json(session);
  }
);

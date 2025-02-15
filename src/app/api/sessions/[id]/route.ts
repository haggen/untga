import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { clearActiveSession, getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.findUniqueOrThrow({
      where: { id, userId },
      omit: {
        secret: true,
      },
    });

    return NextResponse.json(session);
  }
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.update({
      where: { id, userId },
      data: { expiresAt: new Date() },
      omit: {
        secret: true,
      },
    });

    await clearActiveSession();

    return NextResponse.json(session);
  }
);

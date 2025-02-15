import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse } from "@/lib/validation";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: z.string(),
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.findUniqueOrThrow({
      where: { id, userId },
    });

    return NextResponse.json(session);
  }
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: z.string(),
    });

    const { userId } = await getActiveSessionOrThrow();

    const session = await db.session.update({
      where: { id, userId },
      data: { expiresAt: new Date() },
    });

    return NextResponse.json(session);
  }
);

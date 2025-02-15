import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const character = await db.character.findUniqueOrThrow({
      where: { id, userId },
    });

    return NextResponse.json(character);
  }
);

export const PATCH = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const payload = parse(await req.json(), {
      name: schemas.name.optional(),
    });

    const { userId } = await getActiveSessionOrThrow();

    const character = await db.character.update({
      where: { id, userId },
      data: {
        name: payload.name,
      },
    });

    return NextResponse.json(character);
  }
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const character = await db.character.update({
      where: { id, userId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(character);
  }
);

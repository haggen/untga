import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { characterId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const character = await db.character.findUniqueOrThrow({
      where: { id: characterId },
    });

    return NextResponse.json(character);
  }
);

export const PATCH = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const payload = parse(await req.json(), {
      name: schemas.name.optional(),
    });

    const { userId } = await getActiveSessionOrThrow();

    const character = await db.character.update({
      where: { id: characterId, userId },
      data: {
        name: payload.name,
      },
    });

    return NextResponse.json(character);
  }
);

export const DELETE = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const { userId } = await getActiveSessionOrThrow();

    const character = await db.character.update({
      where: { id: characterId, userId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json(character);
  }
);

import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = { characterId: string };

export const POST = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const payload = parse(await req.json(), {
      completesAt: z.string().datetime().optional(),
      data: z.record(z.unknown()).default({}),
    });

    const session = await getActiveSessionOrThrow();

    const character = await db.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundError("Character was not found.");
    }

    if (character.userId !== session.userId) {
      throw new UnauthorizedError("Character does not belong to you.");
    }

    const act = await db.act.create({
      data: {
        characterId,
        completesAt: payload.completesAt,
        data: payload.data,
      },
    });

    return NextResponse.json({ data: act }, { status: 201 });
  }
);

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    const character = await db.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundError("Character was not found.");
    }

    if (character.userId !== session.userId) {
      throw new UnauthorizedError("Character does not belong to you.");
    }

    const where = { characterId };

    const acts = await db.act.findMany({
      where,
      orderBy: { startedAt: "desc" },
    });

    const total = await db.act.count({ where });

    return NextResponse.json({ data: acts, total });
  }
);

import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import * as tags from "@/static/tags";
import { NextResponse } from "next/server";
import { z } from "zod";

type Params = { userId: string };

export const POST = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId } = parse(await params, {
      userId: schemas.id,
    });

    const payload = parse(await req.json(), {
      name: schemas.name,
      description: z.string().max(256).optional(),
    });

    const session = await getActiveSessionOrThrow();

    if (session.userId !== userId) {
      throw new UnauthorizedError();
    }

    const gold = await db.itemSpecification.findFirstOrThrow({
      where: { tags: { hasEvery: ["currency"] } },
    });

    const character = await db.character.create({
      data: {
        name: payload.name,
        user: { connect: { id: session.userId } },
        tags: [tags.Player],
        logs: { create: [{ message: "I'm an adult now and I'm on my own." }] },

        ...(await db.character.withResources()),
        ...(await db.character.withAttributes()),
        ...(await db.character.withLocation()),
        ...(await db.character.withSlots({
          items: {
            create: [{ spec: { connect: { id: gold.id } }, amount: 100 }],
          },
        })),
      },
    });

    return NextResponse.json({ data: character }, { status: 201 });
  }
);

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

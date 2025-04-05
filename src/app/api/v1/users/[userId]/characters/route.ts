import { db, Prisma } from "@/lib/db";
import { UnauthorizedError } from "@/lib/error";
import { withErrorHandling, withMiddleware } from "@/lib/middleware";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import * as tags from "@/static/tags";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withMiddleware(withErrorHandling(), async (context) => {
  const { params, request: req } = context;
  const { userId } = parse(params, {
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
      ...(await db.character.startingAttributes()),
      ...(await db.character.startingLocation()),
      ...(await db.character.startingSlots({
        items: {
          create: [{ spec: { connect: { id: gold.id } }, amount: 100 }],
        },
      })),
    },
  });

  return NextResponse.json({ data: character }, { status: 201 });
});

/**
 * Get all the characters of the authenticated player.
 */
export const GET = withMiddleware(withErrorHandling(), async (context) => {
  const { params } = context;
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const where: Prisma.CharacterWhereInput = {
    userId,
  };

  const characters = await db.character.findMany({
    where,
  });

  const total = await db.character.count({ where });

  return NextResponse.json({ data: characters, total });
});

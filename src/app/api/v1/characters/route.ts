import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db } from "@/lib/db";
import { UnauthorizedError } from "@/lib/error";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import * as tags from "@/static/tags";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withMiddleware(
  withErrorHandling(),
  async ({ request: req }) => {
    const payload = parse(await req.json(), {
      name: schemas.name,
      userId: schemas.id,
      description: z.string().max(256).optional(),
    });

    const session = await getActiveSessionOrThrow();

    if (session.userId !== payload.userId) {
      throw new UnauthorizedError(
        "You can't create a character for someone else."
      );
    }

    const gold = await db.itemSpecification.findFirstOrThrow({
      where: { tags: { hasEvery: ["currency"] } },
    });

    const character = await db.character.create({
      data: {
        name: payload.name,
        description: payload.description,
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

    return NextResponse.json(character, { status: 201 });
  }
);

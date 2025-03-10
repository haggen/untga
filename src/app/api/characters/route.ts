import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import * as tags from "@/static/tags";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = withErrorHandling(async (req) => {
  const payload = parse(await req.json(), {
    name: schemas.name,
    description: z.string().max(256).optional(),
  });

  const session = await getActiveSessionOrThrow();

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
});

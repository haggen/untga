import { z } from "zod";
import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";
import * as tags from "~/static/tags";

export const POST = createApiHandler(async ({ payload, session }) => {
  const data = parse(payload, {
    name: schemas.name,
    userId: schemas.id,
    description: z.string().max(256).optional(),
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  if (session.userId !== data.userId) {
    throw new UnauthorizedError(
      "You can't create a character for someone else."
    );
  }

  const gold = await db.itemSpecification.findFirstOrThrow({
    where: { tags: { hasEvery: ["currency"] } },
  });

  const character = await db.character.create({
    data: {
      name: data.name,
      description: data.description,
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

  return { payload: character };
});

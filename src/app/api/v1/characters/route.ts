import { z } from "zod";
import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";
import { tag } from "~/static/tag";

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

  const character = await db.character.create({
    data: {
      name: data.name,
      description: data.description,
      user: { connect: { id: session.userId } },
      tags: [tag.Player, tag.Idle],
      ...(await db.character.startingLogs()),
      ...(await db.character.startingAttributes()),
      ...(await db.character.startingLocation()),
      ...(await db.character.startingSlots()),
    },
  });

  return { payload: character };
});

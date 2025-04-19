import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const character = await db.character.findUnique({
    where: {
      id: characterId,
    },
  });

  if (!character) {
    throw new NotFoundError("Character not found.");
  }

  const containers = await db.container.findMany({
    where: {
      source: { container: { characterId } },
    },
    include: {
      source: {
        include: {
          spec: true,
        },
      },
      items: {
        include: {
          spec: true,
        },
      },
    },
  });

  return { payload: containers };
});

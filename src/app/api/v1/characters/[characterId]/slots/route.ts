import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const containers = await db.container.findMany({
    where: {
      character: { id: characterId },
    },
    include: {
      items: {
        include: {
          spec: true,
        },
      },
    },
  });

  return { payload: containers };
});

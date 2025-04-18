import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const effects = await db.effect.findMany({
    where: {
      character: { id: characterId },
    },
    include: {
      spec: true,
    },
  });

  return { payload: effects };
});

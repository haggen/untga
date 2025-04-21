import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";
import { tag } from "~/static/tag";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const attributes = await db.attribute.findMany({
    where: {
      character: { id: characterId },
      spec: { tags: { has: tag.Skill } },
    },
    include: {
      spec: true,
    },
  });

  return { payload: attributes };
});

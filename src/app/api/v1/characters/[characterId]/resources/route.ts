import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";
import * as tags from "~/static/tags";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const attributes = await db.attribute.findMany({
    where: {
      character: { id: characterId },
      spec: { tags: { has: tags.Resource } },
    },
    include: {
      spec: true,
    },
  });

  return { payload: attributes };
});

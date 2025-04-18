import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { itemId } = parse(params, {
    itemId: schemas.id,
  });

  const container = await db.container.findUnique({
    where: { sourceId: itemId },
    include: {
      items: { include: { spec: true } },
    },
  });

  if (!container) {
    throw new NotFoundError();
  }

  return { payload: container };
});

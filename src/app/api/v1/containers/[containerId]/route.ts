import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { containerId } = parse(params, {
    containerId: schemas.id,
  });

  const container = await db.container.findUnique({
    where: { id: containerId },
    include: {
      source: { include: { spec: true } },
      items: { include: { spec: true } },
    },
  });

  if (!container) {
    throw new NotFoundError("Container not found.");
  }

  return { payload: container };
});

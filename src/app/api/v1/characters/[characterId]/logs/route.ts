import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const logs = await db.log.findMany({
    where: { characterId },
    orderBy: { createdAt: "desc" },
  });

  return { payload: logs };
});

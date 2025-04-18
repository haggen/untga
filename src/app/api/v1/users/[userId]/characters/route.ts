import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params, session }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  if (session?.userId !== userId) {
    throw new UnauthorizedError();
  }

  const characters = await db.character.findMany({
    where: { userId },
  });

  return { payload: characters };
});

import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params, session }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  if (userId !== session?.userId) {
    throw new UnauthorizedError();
  }

  const sessions = await db.session.findMany({
    where: { userId },
    omit: {
      secret: true,
    },
    orderBy: [{ expiresAt: "desc" }, { createdAt: "desc" }],
  });

  return { payload: sessions };
});

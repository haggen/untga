import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { unsetActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const DELETE = createApiHandler(async ({ params, ...context }) => {
  const { sessionId } = parse(params, {
    sessionId: schemas.id,
  });

  if (!context.session) {
    throw new NotFoundError();
  }

  const session = await db.session.update({
    omit: { secret: true },
    where: { id: sessionId, userId: context.session.userId },
    data: { expiresAt: new Date() },
  });

  if (session.id === context.session.id) {
    await unsetActiveSession();
  }

  return { payload: session };
});

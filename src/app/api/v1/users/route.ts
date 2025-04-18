import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { getRemoteAddr, getUserAgent } from "~/lib/request";
import { setActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const POST = createApiHandler(async ({ request, payload }) => {
  const data = parse(payload, {
    email: schemas.email,
    password: schemas.password,
  });

  const user = await db.user.create({
    data: {
      email: data.email,
      password: data.password,
    },
    omit: {
      password: true,
    },
  });

  const session = await db.session.create({
    data: {
      userId: user.id,
      ip: getRemoteAddr(request),
      userAgent: getUserAgent(request),
    },
  });

  await setActiveSession(session);

  return {
    payload: user,
  };
});

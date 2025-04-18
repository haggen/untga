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

  const user = await db.user.authenticate({
    data: {
      email: data.email,
      password: data.password,
    },
  });

  // We can't omit the secret here...
  const session = await db.session.create({
    data: {
      userId: user.id,
      ip: getRemoteAddr(request),
      userAgent: getUserAgent(request),
    },
  });

  // Because we need the session's secret here.
  await setActiveSession(session);

  // But we still have to omit session's secret from the response.
  return { payload: { ...session, secret: undefined } };
});

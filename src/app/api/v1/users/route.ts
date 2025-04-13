import { NextResponse } from "next/server";
import { withErrorHandling, withMiddleware } from "~/lib/api";
import { db } from "~/lib/db";
import { getBody, getRemoteAddr, getUserAgent } from "~/lib/request";
import { setActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const POST = withMiddleware(withErrorHandling(), async ({ request }) => {
  const payload = parse(await getBody(request), {
    email: schemas.email,
    password: schemas.password,
  });

  const user = await db.user.create({
    data: {
      email: payload.email,
      password: payload.password,
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

  return NextResponse.json(user, { status: 201 });
});

import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { getRemoteAddr, getUserAgent } from "@/lib/request";
import { setActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = withErrorHandling(async (req) => {
  const payload = parse(await req.json(), {
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
      remoteAddr: getRemoteAddr(req),
      userAgent: getUserAgent(req),
    },
  });

  await setActiveSession(session);

  return NextResponse.json({ data: user }, { status: 201 });
});

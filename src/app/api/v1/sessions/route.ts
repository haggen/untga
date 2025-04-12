import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db } from "@/lib/db";
import { getRemoteAddr, getUserAgent } from "@/lib/request";
import { setActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = withMiddleware(
  withErrorHandling(),
  async ({ request: req }) => {
    const payload = parse(await req.json(), {
      email: schemas.email,
      password: schemas.password,
    });

    const user = await db.user.findByCredentials({
      data: {
        email: payload.email,
        password: payload.password,
      },
    });

    // We can't omit the secret here...
    const session = await db.session.create({
      data: {
        userId: user.id,
        ip: getRemoteAddr(req),
        userAgent: getUserAgent(req),
      },
    });

    // Because we need the session's secret here.
    await setActiveSession(session);

    // But we still have to omit session's secret from the response.
    return NextResponse.json(
      { ...session, secret: undefined },
      { status: 201 }
    );
  }
);

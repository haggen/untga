import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { setActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = withErrorHandling(async (req) => {
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

  const session = await db.session.create({
    data: {
      userId: user.id,
    },
  });

  await setActiveSession(session);

  return NextResponse.json(session, { status: 201 });
});

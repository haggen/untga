import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow, setActiveSession } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { userId } = await getActiveSessionOrThrow();

  const where = { userId };

  const sessions = await db.session.findMany({
    where: { userId },
    omit: {
      secret: true,
    },
    orderBy: [{ expiresAt: "desc" }, { createdAt: "desc" }],
  });

  const total = await db.session.count({ where });

  return NextResponse.json({ data: sessions, total });
});

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

  return NextResponse.json(
    { data: { ...session, secret: undefined } },
    { status: 201 }
  );
});

import { db, Session } from "@/lib/prisma";
import { cookies } from "next/headers";
import "server-only";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
  }
}

const cookieId = "sessionId";

export async function getActiveSessionId() {
  return (await cookies()).get(cookieId)?.value;
}

export async function getActiveSession() {
  const sessionId = await getActiveSessionId();

  if (!sessionId) {
    return null;
  }

  return await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
}

export async function getActiveSessionOrThrow() {
  const session = await getActiveSession();

  if (!session) {
    throw new UnauthorizedError();
  }

  return session;
}

export async function setActiveSession(session: Session) {
  (await cookies()).set(cookieId, session.id, {
    expires: session.expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function expireActiveSession() {
  await db.session.update({
    where: { id: await getActiveSessionId() },
    data: { expiresAt: new Date() },
  });

  (await cookies()).delete(cookieId);
}

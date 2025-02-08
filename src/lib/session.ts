import db from "@/lib/database";
import { Session } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

const cookieId = "sessionId";

export async function getActiveSessionId() {
  return (await cookies()).get(cookieId)?.value;
}

export const getActiveSession = cache(async () => {
  const sessionId = await getActiveSessionId();

  if (!sessionId) {
    return null;
  }

  return await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
});

export async function requireActiveSession() {
  const session = await getActiveSession();

  if (!session) {
    redirect("/sign-in");
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

import { db, Session } from "@/lib/db";
import { UnauthorizedError } from "@/lib/error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieId = "session";

export async function getActiveSessionSecret() {
  return (await cookies()).get(cookieId)?.value;
}

export async function getActiveSession() {
  const secret = await getActiveSessionSecret();

  if (!secret) {
    return null;
  }

  return await db.session.findUnique({
    where: { secret, expiresAt: { gt: new Date() } },
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

export async function getActiveSessionOrRedirect() {
  const session = await getActiveSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function setActiveSession(session: Session) {
  (await cookies()).set(cookieId, session.secret, {
    expires: session.expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearActiveSession() {
  (await cookies()).delete(cookieId);
}

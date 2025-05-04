import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, Session } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";

const cookieId = "session";

export async function getActiveSessionSecret() {
  const store = await cookies();
  return store.get(cookieId)?.value;
}

export async function getActiveSession() {
  const secret = await getActiveSessionSecret();

  if (!secret) {
    return null;
  }

  return await db.session.findUnique({
    where: {
      secret,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: { user: true },
  });
}

/**
 * Read active session from cookies or throw.
 *
 * @param recover - Redirect instead of throwing.
 */
export async function ensureActiveSession(recover = false) {
  const session = await getActiveSession();

  if (!session) {
    if (recover) {
      redirect("/login");
    }
    throw new UnauthorizedError();
  }

  return session;
}

export function createCookie(session: Session) {
  return {
    name: cookieId,
    value: session.secret,
    expires: session.expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  } as const;
}

export async function setActiveSession(session: Session) {
  const store = await cookies();
  store.set(createCookie(session));
}

export async function unsetActiveSession() {
  const store = await cookies();
  store.delete(cookieId);
}

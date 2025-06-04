import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db, Session } from "~/db";
import { UnauthorizedError } from "~/lib/error";

/**
 * Session cookie identifier.
 */
const cookieId = "session";

/**
 * Read session secret from cookies.
 */
export async function getSessionSecret() {
  const store = await cookies();
  return store.get(cookieId)?.value;
}

/**
 * Load a Session instance from the database using the session secret stored in cookies.
 */
export async function getSession() {
  const secret = await getSessionSecret();

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
 * @param recoverable - Redirect instead of throwing.
 */
export async function ensureSession(recoverable = false) {
  const session = await getSession();

  if (!session) {
    if (recoverable) {
      redirect("/login");
    }
    throw new UnauthorizedError();
  }

  return session;
}

/**
 * Create session cookie.
 */
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

/**
 * Store given session secret in cookies.
 */
export async function setSession(session: Session) {
  const store = await cookies();
  store.set(createCookie(session));
}

/**
 * Delete session cookie.
 */
export async function clearSession() {
  const store = await cookies();
  store.delete(cookieId);
}

import prisma from "@/lib/prisma";
import { Session } from "@prisma/client";
import { cookies } from "next/headers";
import "server-only";

export async function getActiveSession() {
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    return null;
  }

  return await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
}

export async function setSessionCookie(session: Session) {
  (await cookies()).set("session", session.token, {
    expires: session.expiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSessionCookie() {
  (await cookies()).delete("session");
}

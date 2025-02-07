import prisma from "@/lib/prisma";
import { Session } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";

export const getActiveSession = cache(async () => {
  const token = (await cookies()).get("session")?.value;

  if (!token) {
    return null;
  }

  return await prisma.session.findUnique({
    where: { token },
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

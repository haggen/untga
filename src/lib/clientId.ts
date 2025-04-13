import { randomUUID } from "crypto";
import { cookies } from "next/headers";

const cookieId = "client";

// 400 days is the maximum lifespan of a cookie in Chrome as of 2023.
const maxAge = 60 * 60 * 24 * 400;

export function createCookie(value: string) {
  return {
    name: cookieId,
    value,
    maxAge,
    httpOnly: true, // Only the server can write this cookie.
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  } as const;
}

export async function getClientId() {
  const store = await cookies();
  const cookie = store.get(cookieId);

  if (cookie) {
    return cookie.value;
  }
}

export async function setClientId(clientId: string = randomUUID()) {
  const store = await cookies();
  store.set(createCookie(clientId));
}

import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

const cookieId = "client";

// 400 days is the maximum lifespan of a cookie in Chrome as of 2023.
const maxAge = 60 * 60 * 24 * 400;

export function createCookie(value: string) {
  return {
    name: cookieId,
    value,
    maxAge,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  } as const;
}

export async function getClientId(cookies: Pick<RequestCookies, "get">) {
  const cookie = cookies.get(cookieId);

  if (cookie) {
    return cookie.value;
  }
}

export async function setClientId(
  cookies: Pick<RequestCookies, "set">,
  clientId: string = crypto.randomUUID()
) {
  cookies.set(createCookie(clientId));
}

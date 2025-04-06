import { withErrorHandling, withMiddleware } from "@/lib/api";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const clientCookieId = "client";

function createClientIdCookie(value: string) {
  return {
    name: clientCookieId,
    value,
    // 400 days is the maximum lifespan of a cookie in Chrome as of 2023.
    maxAge: 60 * 60 * 24 * 400,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  } as const;
}

export const GET = withMiddleware(withErrorHandling(), async () => {
  const store = await cookies();
  const clientId = store.get(clientCookieId);

  if (clientId) {
    // Refresh the cookie.
    store.set(createClientIdCookie(clientId.value));
    redirect("/login");
  }

  store.set(createClientIdCookie(randomUUID()));
  redirect("/register");
});

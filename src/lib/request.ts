export function getRemoteAddr(req: Request) {
  // We assume we're behind a proxy that sets this header and we can trust it.
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
}
export function getUserAgent(req: Request) {
  return req.headers.get("user-agent") ?? "";
}

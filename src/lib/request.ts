import { BadRequestError } from "@/lib/error";

export function getRemoteAddr(req: Request) {
  // I'm assuming it's behind a proxy that sets this header and that I can trust it.
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
}

export function getUserAgent(req: Request) {
  return req.headers.get("user-agent") ?? "";
}

export async function getPayload<T = unknown>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new BadRequestError(undefined, { cause: error });
  }
}

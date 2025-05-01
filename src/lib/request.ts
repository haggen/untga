import { BadRequestError } from "~/lib/error";

export function getRemoteAddr(headers: Headers) {
  // I'm assuming it's behind a proxy that sets this header and that I can trust it.
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
}

export function getUserAgent(headers: Headers) {
  return headers.get("user-agent") ?? "";
}

const methodsWithPayload = ["POST", "PUT", "PATCH"];

export async function getRequestPayload(request: Request): Promise<unknown> {
  if (!methodsWithPayload.includes(request.method)) {
    return null;
  }

  const contentType = request.headers.get("content-type");

  if (!contentType) {
    throw new BadRequestError("Request is missing content type.");
  }

  if (contentType.includes("application/json")) {
    try {
      return await request.json();
    } catch (error) {
      throw new BadRequestError("Could not parse JSON.", { cause: error });
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    try {
      return await request.formData();
    } catch (error) {
      throw new BadRequestError("Could not parse form data.", { cause: error });
    }
  }

  throw new BadRequestError(
    `Unsupported content type ${contentType}. Change to application/json or application/x-www-form-urlencoded.`
  );
}

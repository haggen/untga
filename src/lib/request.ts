import { BadRequestError } from "~/lib/error";

/**
 * Get remote client IP address from proxy headers.
 */
export function getRemoteAddr(headers: Headers) {
  // I'm assuming it's behind a proxy that sets this header and that I can trust it.
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
}

/**
 * Get client's user agent string.
 */
export function getUserAgent(headers: Headers) {
  return headers.get("user-agent") ?? "";
}

const methodsWithBody = ["POST", "PUT", "PATCH"];

/**
 * Validate and return the body based on the request's content type.
 */
export async function getBody(request: Request): Promise<unknown> {
  if (!methodsWithBody.includes(request.method)) {
    throw new BadRequestError("Request method does not support a body.");
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
    `Unsupported content type ${contentType}. Supported values are application/json and application/x-www-form-urlencoded.`
  );
}

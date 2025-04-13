import { BadRequestError } from "@/lib/error";

export function getRemoteAddr(request: Request) {
  // I'm assuming it's behind a proxy that sets this header and that I can trust it.
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "";
}

export function getUserAgent(request: Request) {
  return request.headers.get("user-agent") ?? "";
}

export async function getBody(request: Request) {
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

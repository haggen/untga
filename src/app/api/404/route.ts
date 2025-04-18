import { createApiHandler } from "~/lib/api";
import { NotFoundError } from "~/lib/error";

export const GET = createApiHandler(async () => {
  throw new NotFoundError("Endpoint not found.");
});

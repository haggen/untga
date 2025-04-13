import { withErrorHandling, withMiddleware } from "~/lib/api";
import { NotFoundError } from "~/lib/error";

export const GET = withMiddleware(withErrorHandling(), async () => {
  throw new NotFoundError("Not found.");
});

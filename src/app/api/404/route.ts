import { NotFoundError } from "@/lib/error";
import { withErrorHandling, withMiddleware } from "@/lib/middleware";

export const GET = withMiddleware(withErrorHandling(), async () => {
  throw new NotFoundError("Not found.");
});

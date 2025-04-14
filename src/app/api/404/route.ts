import { withErrorHandling, withPipeline } from "~/lib/api";
import { NotFoundError } from "~/lib/error";

export const GET = withPipeline(withErrorHandling(), async () => {
  throw new NotFoundError("Not found.");
});

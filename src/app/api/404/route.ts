import { withErrorHandling } from "@/lib/api";
import { NotFoundError } from "@/lib/error";

export const GET = withErrorHandling(async () => {
  throw new NotFoundError("Not found.");
});

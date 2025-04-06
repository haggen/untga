import { withErrorHandling, withMiddleware } from "@/lib/api";
import { parse, schemas } from "@/lib/validation";
import { permanentRedirect } from "next/navigation";

export const GET = withMiddleware(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  permanentRedirect(`/characters/${characterId}/summary`);
});

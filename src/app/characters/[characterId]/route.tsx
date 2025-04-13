import { permanentRedirect } from "next/navigation";
import { withErrorHandling, withMiddleware } from "~/lib/api";
import { parse, schemas } from "~/lib/validation";

export const GET = withMiddleware(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  permanentRedirect(`/characters/${characterId}/summary`);
});

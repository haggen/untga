import { permanentRedirect } from "next/navigation";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  permanentRedirect(`/characters/${characterId}/summary`);
});

import { permanentRedirect } from "next/navigation";
import { NextRequest } from "next/server";
import { parse, schemas } from "~/lib/validation";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<unknown> }
) {
  const { characterId } = parse(await params, {
    characterId: schemas.id,
  });

  permanentRedirect(`/characters/${characterId}/summary`);
}

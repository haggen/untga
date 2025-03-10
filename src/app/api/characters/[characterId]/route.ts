import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { characterId: string };

/**
 * Get the public profile of a character.
 */
export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const character = await db.character.findUnique({
      where: { id: characterId },
      ...db.character.withPublicData(),
    });

    if (!character) {
      throw new NotFoundError();
    }

    return NextResponse.json({ data: character });
  }
);

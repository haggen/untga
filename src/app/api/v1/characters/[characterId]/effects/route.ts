import { NextResponse } from "next/server";
import { withErrorHandling, withMiddleware } from "~/lib/api";
import { db, Prisma } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = withMiddleware(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const where: Prisma.EffectWhereInput = {
    character: { id: characterId },
  };

  const effects = await db.effect.findMany({
    where,
    include: {
      spec: true,
    },
  });

  const total = await db.effect.count({ where });

  return NextResponse.json(effects, {
    headers: { "X-Total": total.toString() },
  });
});

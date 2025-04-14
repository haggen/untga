import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db, Prisma } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async (context) => {
  const { params } = context;
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const where: Prisma.CharacterWhereInput = {
    userId,
  };

  const characters = await db.character.findMany({
    where,
  });

  const total = await db.character.count({ where });

  return NextResponse.json(characters, {
    headers: { "X-Total": total.toString() },
  });
});

import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db, Prisma } from "~/lib/db";
import { UnauthorizedError } from "~/lib/error";
import { requireActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async ({ params }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const session = await requireActiveSession();

  if (session.userId !== userId) {
    throw new UnauthorizedError("You can't list this user's characters.");
  }

  const where: Prisma.CharacterWhereInput = {
    userId,
    deletedAt: null,
  };

  const characters = await db.character.findMany({
    where,
  });

  const total = await db.character.count({ where });

  return NextResponse.json(characters, {
    headers: { "X-Total": total.toString() },
  });
});

import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db, Prisma } from "@/lib/db";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const where: Prisma.LogWhereInput = {
    character: { id: characterId },
  };

  const logs = await db.log.findMany({
    where,
  });

  const total = await db.log.count({ where });

  return NextResponse.json({ data: logs, total });
});

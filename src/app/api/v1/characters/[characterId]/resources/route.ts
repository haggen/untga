import { db, Prisma } from "@/lib/db";
import { withErrorHandling, withMiddleware } from "@/lib/middleware";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async (context) => {
  const { params } = context;
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const where: Prisma.AttributeWhereInput = {
    character: { id: characterId },
  };

  const attributes = await db.attribute.findMany({
    where,
    include: {
      spec: true,
    },
  });

  const total = await db.attribute.count({ where });

  return NextResponse.json({ data: attributes, total });
});

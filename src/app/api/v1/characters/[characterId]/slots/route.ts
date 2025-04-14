import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db, Prisma } from "~/lib/db";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async ({ params }) => {
  const { characterId } = parse(params, {
    characterId: schemas.id,
  });

  const where: Prisma.ContainerWhereInput = {
    character: { id: characterId },
  };

  const containers = await db.container.findMany({
    where,
    include: {
      items: {
        include: {
          spec: true,
        },
      },
    },
  });

  const total = await db.container.count({ where });

  return NextResponse.json(containers, {
    headers: { "X-Total": total.toString() },
  });
});

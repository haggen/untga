import { db, Prisma } from "@/lib/db";
import { Context, withErrorHandling, withMiddleware } from "@/lib/middleware";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(
  withErrorHandling(),
  async (context: Context) => {
    const { params } = context;
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

    return NextResponse.json({ data: containers, total });
  }
);

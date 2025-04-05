import { Context, withErrorHandling, withMiddleware } from "@/lib/api";
import { db, Prisma } from "@/lib/db";
import { parse, schemas } from "@/lib/validation";
import * as tags from "@/static/tags";
import { NextResponse } from "next/server";

export const GET = withMiddleware(
  withErrorHandling(),
  async (context: Context) => {
    const { params } = context;
    const { characterId } = parse(params, {
      characterId: schemas.id,
    });

    const where: Prisma.AttributeWhereInput = {
      character: { id: characterId },
      spec: { tags: { has: tags.Skill } },
    };

    const attributes = await db.attribute.findMany({
      where,
      include: {
        spec: true,
      },
    });

    const total = await db.attribute.count({ where });

    return NextResponse.json({ data: attributes, total });
  }
);

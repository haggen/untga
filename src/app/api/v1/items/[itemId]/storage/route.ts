import { Context, withErrorHandling, withMiddleware } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(
  withErrorHandling(),
  async (context: Context) => {
    const { params } = context;
    const { itemId } = parse(params, {
      itemId: schemas.id,
    });

    const container = await db.container.findUnique({
      where: { sourceId: itemId },
      include: {
        items: { include: { spec: true } },
      },
    });

    if (!container) {
      throw new NotFoundError();
    }

    return NextResponse.json(container);
  }
);

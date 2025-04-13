import { NextResponse } from "next/server";
import { withErrorHandling, withMiddleware } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = withMiddleware(withErrorHandling(), async ({ params }) => {
  const { itemId } = parse(params, {
    itemId: schemas.id,
  });

  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      spec: true,
    },
  });

  if (!item) {
    throw new NotFoundError("Item not found.");
  }

  return NextResponse.json(item);
});

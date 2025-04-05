import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { withErrorHandling, withMiddleware } from "@/lib/middleware";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async (context) => {
  const { params } = context;
  const { containerId } = parse(params, {
    containerId: schemas.id,
  });

  const container = await db.container.findUnique({
    where: { id: containerId },
    include: {
      source: { include: { spec: true } },
      items: { include: { spec: true } },
    },
  });

  if (!container) {
    throw new NotFoundError("Container not found.");
  }

  return NextResponse.json({ data: container });
});

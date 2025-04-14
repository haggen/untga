import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async (context) => {
  const { params } = context;
  const { locationId } = parse(params, {
    locationId: schemas.id,
  });

  const location = await db.location.findUnique({
    where: { id: locationId },
    include: { exits: { include: { exit: true } } },
  });

  if (!location) {
    throw new NotFoundError("Location not found.");
  }

  const total = await db.route.count({
    where: { entry: { id: locationId } },
  });

  return NextResponse.json(location.exits, {
    headers: { "X-Total": total.toString() },
  });
});

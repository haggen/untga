import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async (context) => {
  const { params } = context;
  const { locationId } = parse(params, {
    locationId: schemas.id,
  });

  const location = await db.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw new NotFoundError("Location not found.");
  }

  return NextResponse.json(location);
});

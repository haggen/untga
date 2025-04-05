import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db, Prisma } from "@/lib/db";
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

  const where: Prisma.CharacterWhereInput = { locationId };

  const characters = await db.character.findMany({
    where,
  });

  const total = await db.character.count({
    where,
  });

  return NextResponse.json({ data: characters, total });
});

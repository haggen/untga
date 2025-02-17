import { withErrorHandling } from "@/lib/api";
import { db, Prisma } from "@/lib/prisma";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async (req) => {
  const { entryId } = parse(req.nextUrl.searchParams, {
    entryId: schemas.id.optional(),
  });

  const criteria: Prisma.LocationWhereInput = {};

  // Filter by locations that can be entered from another location.
  if (entryId) {
    criteria.exits = { some: { entryId } };
  }

  const locations = await db.location.findMany({
    where: criteria,
  });

  const total = await db.location.count({ where: criteria });

  return NextResponse.json({ data: locations, total });
});

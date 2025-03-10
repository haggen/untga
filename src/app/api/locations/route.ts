import { withErrorHandling } from "@/lib/api";
import { db, Prisma } from "@/lib/db";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async (req) => {
  const { exitId } = parse(req.nextUrl.searchParams, {
    exitId: schemas.id.optional(),
  });

  const criteria: Prisma.LocationWhereInput = {};

  // Get only locations that can be entered from a specified exit location.
  if (exitId) {
    criteria.entries = { some: { exitId } };
  }

  const locations = await db.location.findMany({
    where: criteria,
  });

  const total = await db.location.count({ where: criteria });

  return NextResponse.json({ data: locations, total });
});

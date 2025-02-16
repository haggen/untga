import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async (req) => {
  const { entryId } = parse(req.nextUrl.searchParams, {
    // Filter by locations that can be entered from this location ID.
    entryId: schemas.id.optional(),
  });

  const locations = await db.location.findMany({
    where: { exits: entryId ? { some: { entryId } } : undefined },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(locations);
});

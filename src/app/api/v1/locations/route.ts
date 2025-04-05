import { withErrorHandling, withMiddleware } from "@/lib/api";
import { db, Prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = withMiddleware(withErrorHandling(), async () => {
  const where: Prisma.LocationWhereInput = {};

  const locations = await db.location.findMany({
    where,
  });

  const total = await db.location.count({ where });

  return NextResponse.json({ data: locations, total });
});

import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db, Prisma } from "~/lib/db";

export const GET = withPipeline(withErrorHandling(), async () => {
  const where: Prisma.LocationWhereInput = {};

  const locations = await db.location.findMany({
    where,
  });

  const total = await db.location.count({ where });

  const response = NextResponse.json(locations);
  response.headers.set("X-Total", total.toString());
  return response;
});

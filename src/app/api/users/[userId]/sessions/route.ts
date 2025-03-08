import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { getActiveSessionOrThrow } from "@/lib/session";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { userId } = await getActiveSessionOrThrow();

  const where = { userId };

  const sessions = await db.session.findMany({
    where: { userId },
    omit: {
      secret: true,
    },
    orderBy: [{ expiresAt: "desc" }, { createdAt: "desc" }],
  });

  const total = await db.session.count({ where });

  return NextResponse.json({ data: sessions, total });
});

import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ locationId: string }> }) => {
    const { locationId } = parse(await params, {
      locationId: schemas.id,
    });

    const location = await db.location.findUniqueOrThrow({
      where: { id: locationId },
    });

    return NextResponse.json(location);
  }
);

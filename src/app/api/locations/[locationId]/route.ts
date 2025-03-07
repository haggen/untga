import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/error";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { locationId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { locationId } = parse(await params, {
      locationId: schemas.id,
    });

    const location = await db.location.findUnique({
      where: { id: locationId },
    });

    if (!location) {
      throw new NotFoundError("Location not found.");
    }

    return NextResponse.json({ data: location });
  }
);

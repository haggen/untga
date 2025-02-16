import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ characterId: string }> }) => {
    const { characterId } = parse(await params, {
      characterId: schemas.id,
    });

    const items = await db.item.findMany({
      where: { container: { character: { id: characterId } } },
      include: { specification: true },
    });

    return NextResponse.json(items);
  }
);

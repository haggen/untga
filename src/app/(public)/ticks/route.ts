import db from "@/lib/database";

/**
 * Real world time is scaled by this constant.
 */
const simulationTimeScale = 60;

export async function POST() {
  const now = Date.now();

  const lastTick = await db.tick.findFirstOrThrow({
    orderBy: { id: "desc" },
  });

  // Game time is recorded in seconds due to issues with Prisma's integer field type.
  const delta = Math.floor(
    ((now - lastTick.createdAt.getTime()) / 1000) * simulationTimeScale
  );

  const tick = await db.tick.create({
    data: {
      delta,
      elapsed: lastTick.elapsed + delta,
    },
  });

  const characters = await db.character.findMany({
    orderBy: { id: "asc" },
  });

  // Walk over characters and update their age.
  for (const character of characters) {
    await db.character.update({
      where: { id: character.id },
      data: { age: { increment: tick.delta } },
    });
  }

  return Response.json(tick, { status: 201 });
}

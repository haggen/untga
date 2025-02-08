import prisma from "@/lib/prisma";

export async function POST() {
  const tick = await prisma.tick.create({});
  return Response.json(tick, { status: 201 });
}

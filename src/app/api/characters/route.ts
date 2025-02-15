import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(async () => {
  const { userId } = await getActiveSessionOrThrow();

  const characters = await db.character.findMany({
    where: { userId },
  });

  return NextResponse.json(characters);
});

export const POST = withErrorHandling(async (req) => {
  const payload = parse(await req.json(), {
    name: schemas.name,
  });

  const { userId } = await getActiveSessionOrThrow();

  const attributeSpecifications = await db.attributeSpecification.findMany({
    where: { tags: { has: "playable-character-attribute" } },
  });

  const container = await db.container.create({ data: {} });

  const location = await db.location.findFirstOrThrow({
    where: { tags: { has: "starting-location" } },
  });

  const character = await db.character.create({
    data: {
      userId,
      name: payload.name,
      containerId: container.id,
      locationId: location.id,
      attributes: {
        create: attributeSpecifications.map(({ id }) => ({
          specificationId: id,
        })),
      },
      logs: { create: [{ message: "I'm an adult now and I'm on my own." }] },
    },
  });

  return NextResponse.json(character, { status: 201 });
});

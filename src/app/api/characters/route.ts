import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const POST = withErrorHandling(async (req) => {
  const payload = parse(await req.json(), {
    name: schemas.name,
  });

  const session = await getActiveSessionOrThrow();

  const playableCharacterAttributes = await db.attributeSpecification.findMany({
    where: { tags: { has: "player" } },
  });

  const startingLocation = await db.location.findFirstOrThrow({
    where: { tags: { has: "starting-location" } },
  });

  const character = await db.character.create({
    data: {
      name: payload.name,
      user: { connect: { id: session.userId } },
      container: { create: {} },
      location: { connect: { id: startingLocation.id } },
      attributes: {
        create: playableCharacterAttributes.map(({ id }) => ({
          specificationId: id,
        })),
      },
      logs: { create: [{ message: "I'm an adult now and I'm on my own." }] },
    },
  });

  return NextResponse.json({ data: character }, { status: 201 });
});

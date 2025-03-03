import { withErrorHandling } from "@/lib/api";
import { UnauthorizedError } from "@/lib/error";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

type Params = { userId: string };

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId } = parse(await params, {
      userId: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    if (session.userId !== userId) {
      throw new UnauthorizedError();
    }

    const characters = await db.character.findMany({
      where: { userId },
    });

    const total = await db.character.count({ where: { userId } });

    return NextResponse.json({ data: characters, total });
  }
);

export const POST = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId } = parse(await params, {
      userId: schemas.id,
    });

    const payload = parse(await req.json(), {
      name: schemas.name,
    });

    const session = await getActiveSessionOrThrow();

    if (session.userId !== userId) {
      throw new UnauthorizedError();
    }

    const playableCharacterAttributes =
      await db.attributeSpecification.findMany({
        where: { tags: { has: "player" } },
      });

    const startingLocation = await db.location.findFirstOrThrow({
      where: { tags: { has: "starting-location" } },
    });

    const character = await db.character.create({
      data: {
        name: payload.name,
        user: { connect: { id: userId } },
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
  }
);

import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/prisma";
import { getActiveSessionOrThrow } from "@/lib/session";
import { parse, schemas } from "@/lib/validation";
import { NextResponse } from "next/server";

export const GET = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const session = await getActiveSessionOrThrow();

    if (id !== session.userId) {
      return NextResponse.json(null, { status: 404 });
    }

    const user = await db.user.findUniqueOrThrow({
      where: { id },
      omit: {
        password: true,
      },
    });

    return NextResponse.json(user);
  }
);

export const PATCH = withErrorHandling(
  async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = parse(await params, {
      id: schemas.id,
    });

    const payload = parse(await req.json(), {
      email: schemas.email.optional(),
      password: schemas.password.optional(),
    });

    const session = await getActiveSessionOrThrow();

    if (id !== session.userId) {
      return NextResponse.json(null, { status: 404 });
    }

    const user = await db.user.update({
      where: { id },
      omit: {
        password: true,
      },
      data: {
        email: payload.email,
        password: payload.password,
      },
    });

    return NextResponse.json(user);
  }
);

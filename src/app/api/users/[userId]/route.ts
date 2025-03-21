import { withErrorHandling } from "@/lib/api";
import { db } from "@/lib/db";
import { NotFoundError, UnauthorizedError } from "@/lib/error";
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

    if (userId !== session.userId) {
      throw new UnauthorizedError();
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundError();
    }

    return NextResponse.json({ data: user });
  }
);

export const PATCH = withErrorHandling(
  async (req, { params }: { params: Promise<Params> }) => {
    const { userId } = parse(await params, {
      userId: schemas.id,
    });

    const payload = parse(await req.json(), {
      email: schemas.email.optional(),
      password: schemas.password.optional(),
    });

    const session = await getActiveSessionOrThrow();

    if (userId !== session.userId) {
      throw new UnauthorizedError();
    }

    const user = await db.user.update({
      where: { id: userId },
      omit: {
        password: true,
      },
      data: {
        email: payload.email,
        password: payload.password,
      },
    });

    return NextResponse.json({ data: user });
  }
);

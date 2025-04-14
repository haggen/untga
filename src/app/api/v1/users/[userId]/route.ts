import { NextResponse } from "next/server";
import { withErrorHandling, withPipeline } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { getBody } from "~/lib/request";
import { requireActiveSession } from "~/lib/session";
import { parse, schemas } from "~/lib/validation";

export const GET = withPipeline(withErrorHandling(), async ({ params }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const session = await requireActiveSession();

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

  return NextResponse.json(user);
});

export const PATCH = withPipeline(
  withErrorHandling(),
  async ({ params, request }) => {
    const { userId } = parse(params, {
      userId: schemas.id,
    });

    const payload = parse(await getBody(request), {
      email: schemas.email.optional(),
      password: schemas.password.optional(),
    });

    const session = await requireActiveSession();

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

    return NextResponse.json(user);
  }
);

export const DELETE = withPipeline(withErrorHandling(), async ({ params }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const session = await requireActiveSession();

  if (userId !== session.userId) {
    throw new UnauthorizedError();
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(user);
});

import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { parse, schemas } from "~/lib/validation";

export const GET = createApiHandler(async ({ params, session }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  if (userId !== session?.userId) {
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

  return { payload: user };
});

export const PATCH = createApiHandler(async ({ params, payload, session }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  const data = parse(payload, {
    email: schemas.email.optional(),
    password: schemas.password.optional(),
  });

  if (!session) {
    throw new UnauthorizedError();
  }

  if (userId !== session.userId) {
    throw new UnauthorizedError();
  }

  const user = await db.user.update({
    where: { id: userId },
    omit: {
      password: true,
    },
    data: {
      email: data.email,
      password: data.password,
    },
  });

  return { payload: user };
});

export const DELETE = createApiHandler(async ({ params, session }) => {
  const { userId } = parse(params, {
    userId: schemas.id,
  });

  if (userId !== session?.userId) {
    throw new UnauthorizedError();
  }

  const user = await db.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() },
  });

  return { payload: user };
});

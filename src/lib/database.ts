export type * from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";

type Args<T> = { data: T | T[] } | { create: T } | { update: T };

/**
 * Isolate data from a query operation and pass it to a handler.
 */
async function apply<T extends Record<string, unknown>>(
  args: Args<T>,
  handler: (data: T) => Promise<void>
) {
  if ("create" in args) {
    await handler(args.create);
  }

  if ("update" in args) {
    await handler(args.update);
  }

  if ("data" in args) {
    if (Array.isArray(args.data)) {
      for (const data of args.data) {
        await handler(data);
      }
    } else {
      await handler(args.data);
    }
  }
}

/**
 * Find a user by email and password.
 */
async function findByCredentials({
  data,
}: {
  data: { email: string; password: string };
}) {
  const user = await db.user.findFirstOrThrow({
    where: { email: data.email },
  });

  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new Error("Password doesn't match");
  }

  return user;
}

/**
 * Encrypt user's password.
 */
async function encryptPassword(data: { password?: unknown }) {
  if (typeof data.password === "string") {
    data.password = await bcrypt.hash(data.password, 10);
  }
}

/**
 * Assign a default expiration date to the session data.
 */
async function setSessionDefaultExpiry(data: { expiresAt?: unknown }) {
  data.expiresAt ??= DateTime.now().plus({ day: 1 }).toJSDate();
}

export const db = new PrismaClient().$extends({
  model: {
    user: {
      findByCredentials,
    },
    action: {
      pending() {
        return { OR: [{ startedAtEpoch: null }, { completedAtEpoch: null }] };
      },
    },
    tick: {
      async latest() {
        return await db.tick.findFirstOrThrow({
          orderBy: { id: "desc" },
        });
      },
    },
  },
  query: {
    user: {
      async $allOperations({ operation, query, args }) {
        switch (operation) {
          case "create":
          case "createMany":
          case "createManyAndReturn":
          case "update":
          case "updateMany":
          case "updateManyAndReturn":
          case "upsert":
            await apply(args, encryptPassword);
            break;
        }
        return await query(args);
      },
    },
    session: {
      async $allOperations({ operation, query, args }) {
        switch (operation) {
          case "create":
          case "createMany":
          case "createManyAndReturn":
          case "update":
          case "updateMany":
          case "updateManyAndReturn":
          case "upsert":
            await apply(args, setSessionDefaultExpiry);
            break;
        }
        return await query(args);
      },
    },
  },
  result: {
    action: {
      status: {
        needs: { startedAtEpoch: true, completedAtEpoch: true },
        compute(action) {
          if (action.completedAtEpoch) {
            return "completed";
          }

          if (action.startedAtEpoch) {
            return "in progress";
          }

          return "pending";
        },
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  (global as unknown as { prisma: typeof db }).prisma = db;
}

export default db;

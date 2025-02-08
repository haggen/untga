export type * from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";

type Args<T> = { data: T | T[] } | { create: T } | { update: T };

async function transform<T extends Record<string, unknown>>(
  args: Args<T>,
  callback: (data: T) => Promise<void>
) {
  if ("create" in args) {
    await callback(args.create);
  }

  if ("update" in args) {
    await callback(args.update);
  }

  if ("data" in args) {
    if (Array.isArray(args.data)) {
      for (const data of args.data) {
        await callback(data);
      }
    } else {
      await callback(args.data);
    }
  }
}

export const db = new PrismaClient().$extends({
  model: {
    user: {
      async findByCredentials({
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
            await transform(args, async (data) => {
              if (typeof data.password === "string") {
                data.password = await bcrypt.hash(data.password, 10);
              }
            });
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
            await transform(args, async (data) => {
              const expiresAt = DateTime.now().plus({ day: 1 }).toJSDate();
              data.expiresAt ??= expiresAt;
            });
            break;
        }
        return await query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  (global as unknown as { prisma: typeof db }).prisma = db;
}

export default db;

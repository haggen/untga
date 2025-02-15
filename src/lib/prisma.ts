import { Prisma, PrismaClient } from "@prisma/client";
import type { Operation } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";

export { Prisma };

export type AttributeSpecification<T = unknown> = Prisma.Result<
  typeof db.attributeSpecification,
  T,
  "findFirstOrThrow"
>;

export type Attribute<T = unknown> = Prisma.Result<
  typeof db.attribute,
  T,
  "findFirstOrThrow"
>;

export type Character<T = unknown> = Prisma.Result<
  typeof db.character,
  T,
  "findFirstOrThrow"
>;

export type Session<T = unknown> = Prisma.Result<
  typeof db.session,
  T,
  "findFirstOrThrow"
>;

export type Location<T = unknown> = Prisma.Result<
  typeof db.location,
  T,
  "findFirstOrThrow"
>;

export type Path<T = unknown> = Prisma.Result<
  typeof db.path,
  T,
  "findFirstOrThrow"
>;

export type Log<T = unknown> = Prisma.Result<
  typeof db.log,
  T,
  "findFirstOrThrow"
>;

export type User<T = unknown> = Prisma.Result<
  typeof db.user,
  T,
  "findFirstOrThrow"
>;

export type ItemSpecification<T = unknown> = Prisma.Result<
  typeof db.itemSpecification,
  T,
  "findFirstOrThrow"
>;

export type Item<T = unknown> = Prisma.Result<
  typeof db.item,
  T,
  "findFirstOrThrow"
>;

/**
 * Isolate data from the query args and pass it to a handler.
 */
async function handle<T, O extends Operation>(
  args: Prisma.Args<T, O>,
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
 * Prisma client.
 */
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
      async $allOperations({ operation, args, query }) {
        switch (operation) {
          case "create":
          case "createMany":
          case "createManyAndReturn":
          case "update":
          case "updateMany":
          case "updateManyAndReturn":
          case "upsert":
            await handle(args, async (data: Prisma.UserUpdateInput) => {
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
      async $allOperations({ operation, args, query }) {
        switch (operation) {
          case "create":
          case "createMany":
          case "createManyAndReturn":
          case "update":
          case "updateMany":
          case "updateManyAndReturn":
          case "upsert":
            await handle(args, async (data: Prisma.SessionUpdateInput) => {
              data.expiresAt ??= DateTime.now().plus({ day: 1 }).toJSDate();
            });
            break;
        }
        return await query(args);
      },
    },
  },
  result: {},
});

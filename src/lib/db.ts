import * as tags from "@/static/tags";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientOptions } from "@prisma/client/runtime/client";
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

export type Container<T = unknown> = Prisma.Result<
  typeof db.container,
  T,
  "findFirstOrThrow"
>;

export type Slot<T = unknown> = Prisma.Result<
  typeof db.slot,
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

const opts = {
  log: ["query", "info", "warn"],
} satisfies PrismaClientOptions;

const ext = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      user: {
        async findByCredentials({
          data,
        }: {
          data: { email: string; password: string };
        }) {
          const user = await db.user.findUnique({
            where: { email: data.email },
          });

          if (!user) {
            throw new Error("E-mail not found");
          }

          if (!(await bcrypt.compare(data.password, user.password))) {
            throw new Error("Password doesn't match");
          }

          return user;
        },
      },
      itemSpecification: {
        findByTags(...tags: string[]) {
          return db.itemSpecification.findFirstOrThrow({
            where: { tags: { hasEvery: tags } },
          });
        },
      },
      character: {
        withPublicData() {
          return {
            omit: { locationId: true },
            include: {
              attributes: { include: { spec: true } },
              resources: { include: { spec: true } },
              slots: { include: { item: { include: { spec: true } } } },
            },
          } satisfies Prisma.CharacterFindManyArgs;
        },
        /**
         * Get character creation input data for starting slots.
         */
        async withSlots({
          items,
        }: {
          items?: Prisma.ItemCreateNestedManyWithoutContainerInput;
        }) {
          return {
            slots: {
              create: [
                { type: tags.Head },
                { type: tags.Chest },
                { type: tags.Weapon },
                {
                  type: tags.Storage,
                  item: {
                    create: {
                      spec: {
                        connect: {
                          id: (
                            await db.itemSpecification.findByTags(
                              tags.Storage,
                              tags.StartingEquipment
                            )
                          ).id,
                        },
                      },
                      storage: {
                        create: {
                          items,
                        },
                      },
                    },
                  },
                },
              ],
            },
          } satisfies Pick<Prisma.CharacterCreateInput, "slots">;
        },

        /**
         * Get character creation input data for starting attributes.
         */
        async withAttributes() {
          const attributes = await db.attributeSpecification.findMany();
          return {
            attributes: {
              create: attributes.map(({ id }) => ({
                specId: id,
              })),
            },
          } satisfies Pick<Prisma.CharacterCreateInput, "attributes">;
        },

        /**
         * Get character creation input data for starting resources.
         */
        async withResources() {
          const resources = await db.resourceSpecification.findMany();

          return {
            resources: {
              create: resources.map(({ id }) => ({
                specId: id,
              })),
            },
          } satisfies Pick<Prisma.CharacterCreateInput, "resources">;
        },

        /**
         * Get character creation input data for starting location.
         */
        async withLocation() {
          const location = await db.location.findFirstOrThrow({
            where: { tags: { has: tags.StartingLocation } },
          });

          return {
            location: { connect: { id: location.id } },
          } satisfies Pick<Prisma.CharacterCreateInput, "location">;
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
    result: {
      session: {
        expired: {
          needs: { expiresAt: true },
          compute(session) {
            return session.expiresAt <= new Date();
          },
        },
      },
    },
  });
});

// Client is created inside a function so we can have the final type, via ReturnType<T> without instancing it.
function createClient() {
  return new PrismaClient(opts).$extends(ext);
}

// Update global interface with our client.
declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof createClient>;
}

// Prisma client needs to be a singleton, otherwise it eventually exhausts the database connection pool.
export const db =
  process.env.NODE_ENV === "production"
    ? (global.db ??= createClient())
    : createClient();

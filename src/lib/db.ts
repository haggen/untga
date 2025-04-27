import { Prisma, PrismaClient } from "@prisma/client";
import type {
  Operation,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { NotFoundError, UnauthorizedError } from "~/lib/error";
import { tag } from "~/static/tag";

export { Prisma };

export type User<T = unknown> = Prisma.Result<
  typeof db.user,
  T,
  "findFirstOrThrow"
>;

export type Session<T = unknown> = Prisma.Result<
  typeof db.session,
  T,
  "findFirstOrThrow"
>;

export type Character<T = unknown> = Prisma.Result<
  typeof db.character,
  T,
  "findFirstOrThrow"
>;

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

export type EffectSpecification<T = unknown> = Prisma.Result<
  typeof db.effectSpecification,
  T,
  "findFirstOrThrow"
>;

export type Effect<T = unknown> = Prisma.Result<
  typeof db.effect,
  T,
  "findFirstOrThrow"
>;

export type Log<T = unknown> = Prisma.Result<
  typeof db.log,
  T,
  "findFirstOrThrow"
>;

export type Container<T = unknown> = Prisma.Result<
  typeof db.container,
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

export type Location<T = unknown> = Prisma.Result<
  typeof db.location,
  T,
  "findFirstOrThrow"
>;

export type WithLocation = {
  include: {
    location: true;
  };
};

export type WithSpec = {
  include: { spec: true };
};

export type WithAttributes = {
  include: { attributes: WithSpec };
};

export type WithEffects = {
  include: { effects: WithSpec };
};

export type WithSlots = {
  include: { slots: WithItems };
};

export type WithItems = {
  include: { items: WithSpec };
};

export type WithSource = {
  include: { source: WithSpec };
};

export type WithEntry = {
  include: { entry: true };
};

export type WithRoutes = {
  include: { routes: true };
};

export type WithUser = {
  include: { user: true };
};

export type WithCharacters = {
  include: { characters: true };
};

export type WithDestinations = {
  include: { destinations: true };
};

export type WithStorage = {
  include: { items: WithSpec & { include: { storage: WithItems } } };
};

/**
 * Isolate data from the query args and pass it to a handler.
 */
async function applyDataMod<T, O extends Operation>(
  args: Prisma.Args<T, O>,
  modify: (data: T) => Promise<void>
) {
  if ("create" in args) {
    await modify(args.create);
  }

  if ("update" in args) {
    await modify(args.update);
  }

  if ("data" in args) {
    if (Array.isArray(args.data)) {
      for (const data of args.data) {
        await modify(data);
      }
    } else {
      await modify(args.data);
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
        async authenticate({
          data,
        }: {
          data: { email: string; password: string };
        }) {
          const user = await db.user.findUnique({
            where: { email: data.email },
          });

          if (!user) {
            throw new NotFoundError("E-mail was not found.");
          }

          if (!(await bcrypt.compare(data.password, user.password))) {
            throw new UnauthorizedError("Password doesn't match.");
          }

          return user;
        },
      },
      session: {
        valid() {
          return {
            expiresAt: {
              gt: new Date(),
            },
          };
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
        /**
         * Equipment slots and initial gear for new characters.
         */
        async startingSlots() {
          const tunic = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Equipment,
            tag.Torso
          );

          const trousers = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Equipment,
            tag.Legs
          );

          const shoes = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Equipment,
            tag.Feet
          );

          const pack = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Equipment,
            tag.Pack,
            tag.Storage
          );

          const gold = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Currency
          );

          const dagger = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Weapon
          );

          const food = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Food
          );

          const wine = await db.itemSpecification.findByTags(
            tag.Starting,
            tag.Drink
          );

          return {
            slots: {
              create: [
                { tags: [tag.Slot, tag.Head] },
                { tags: [tag.Slot, tag.Overgarment] },
                {
                  tags: [tag.Slot, tag.Torso],
                  items: {
                    create: { amount: 1, spec: { connect: { id: tunic.id } } },
                  },
                },
                { tags: [tag.Slot, tag.Waist] },
                { tags: [tag.Slot, tag.Hands] },
                {
                  tags: [tag.Slot, tag.Legs],
                  items: {
                    create: {
                      amount: 1,
                      spec: { connect: { id: trousers.id } },
                    },
                  },
                },
                {
                  tags: [tag.Slot, tag.Feet],
                  items: {
                    create: { amount: 1, spec: { connect: { id: shoes.id } } },
                  },
                },
                {
                  tags: [tag.Slot, tag.Pack],
                  items: {
                    create: {
                      spec: {
                        connect: {
                          id: pack.id,
                        },
                      },
                      storage: {
                        create: {
                          items: {
                            create: [
                              {
                                amount: 100,
                                spec: {
                                  connect: {
                                    id: gold.id,
                                  },
                                },
                              },
                              {
                                amount: 1,
                                spec: {
                                  connect: {
                                    id: dagger.id,
                                  },
                                },
                              },
                              {
                                amount: 1,
                                spec: {
                                  connect: {
                                    id: food.id,
                                  },
                                },
                              },
                              {
                                amount: 1,
                                spec: {
                                  connect: {
                                    id: wine.id,
                                  },
                                },
                              },
                            ],
                          },
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
         * Set of default resources and skills for new characters.
         */
        async startingAttributes() {
          const attributes = await db.attributeSpecification.findMany({
            where: {
              tags: { has: tag.Starting },
            },
          });

          return {
            attributes: {
              create: attributes.map(({ id }) => ({
                specId: id,
              })),
            },
          } satisfies Pick<Prisma.CharacterCreateInput, "attributes">;
        },

        /**
         * Get character creation input data for initial location.
         */
        async startingLocation() {
          const location = await db.location.findFirstOrThrow({
            where: { tags: { has: tag.Starting } },
          });

          return {
            location: { connect: { id: location.id } },
          } satisfies Pick<Prisma.CharacterCreateInput, "location">;
        },

        async startingLogs() {
          return {
            logs: {
              create: [
                {
                  message: "I'm an adult now and I'm on my own.",
                },
              ],
            },
          } satisfies Pick<Prisma.CharacterCreateInput, "logs">;
        },
      },
    },
    query: {
      user: {
        async $allOperations({ operation, args, query }) {
          switch (operation) {
            case "findFirst":
            case "findFirstOrThrow":
            case "findUnique":
            case "findUniqueOrThrow":
            case "findMany":
              args.where = {
                ...args.where,
                deletedAt: args.where?.deletedAt ?? null,
              };
              break;
            case "create":
            case "createMany":
            case "createManyAndReturn":
            case "update":
            case "updateMany":
            case "updateManyAndReturn":
            case "upsert":
              await applyDataMod(args, async (data: Prisma.UserUpdateInput) => {
                if (typeof data.password === "string") {
                  data.password = await bcrypt.hash(data.password, 10);
                }
              });
              break;
          }
          return await query(args);
        },
      },
      character: {
        async $allOperations({ operation, args, query }) {
          switch (operation) {
            case "findFirst":
            case "findFirstOrThrow":
            case "findUnique":
            case "findUniqueOrThrow":
            case "findMany":
              args.where = {
                ...args.where,
                deletedAt: args.where?.deletedAt ?? null,
              };
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
              await applyDataMod(
                args,
                async (data: Prisma.SessionUpdateInput) => {
                  data.expiresAt ??= DateTime.now().plus({ day: 1 }).toJSDate();
                }
              );
              break;
          }
          return await query(args);
        },
      },
    },
    result: {
      user: {
        deleted: {
          needs: { deletedAt: true },
          compute(user) {
            return user.deletedAt !== null;
          },
        },
      },
      character: {
        status: {
          needs: { tags: true },
          compute(character) {
            if (character.tags.includes(tag.Idle)) {
              return "Idle";
            }

            if (character.tags.includes(tag.Travelling)) {
              return "Travelling";
            }

            if (character.tags.includes(tag.Healing)) {
              return "Healing";
            }

            if (character.tags.includes(tag.Crafting)) {
              return "Crafting";
            }

            if (character.tags.includes(tag.Foraging)) {
              return "Foraging";
            }

            return "Unknown";
          },
        },
        deleted: {
          needs: { deletedAt: true },
          compute(character) {
            return character.deletedAt !== null;
          },
        },
      },
      session: {
        expired: {
          needs: { expiresAt: true },
          compute(session) {
            return session.expiresAt <= new Date();
          },
        },
      },
      container: {
        slot: {
          needs: { tags: true },
          compute(container) {
            if (!container.tags.includes(tag.Slot)) {
              return null;
            }

            if (container.tags.includes(tag.Head)) {
              return "Head";
            }

            if (container.tags.includes(tag.Overgarment)) {
              return "Overgarment";
            }

            if (container.tags.includes(tag.Torso)) {
              return "Chest";
            }

            if (container.tags.includes(tag.Waist)) {
              return "Waist";
            }

            if (container.tags.includes(tag.Hands)) {
              return "Hands";
            }

            if (container.tags.includes(tag.Legs)) {
              return "Legs";
            }

            if (container.tags.includes(tag.Feet)) {
              return "Feet";
            }

            if (container.tags.includes(tag.Pack)) {
              return "Pack";
            }

            return "Unknown";
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

export type Client = ReturnType<typeof createClient>;

// Prisma client needs to be a singleton, otherwise it eventually exhausts the database connection pool.
export const db =
  process.env.NODE_ENV === "production"
    ? ((global as unknown as { db: Client }).db ??= createClient())
    : createClient();

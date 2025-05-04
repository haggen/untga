import { Prisma, PrismaClient } from "@prisma/client";
import type {
  Operation,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { ensure } from "~/lib/ensure";
import { tags } from "~/lib/tags";

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
      user: {},
      session: {
        async createByCredentials({
          data,
        }: {
          data: {
            email: string;
            password: string;
            userAgent: string;
            ip: string;
          };
        }) {
          const user = await db.user.findUniqueOrThrow({
            where: { email: data.email },
          });

          if (!(await bcrypt.compare(data.password, user.password))) {
            throw new Error("Password doesn't match.");
          }

          return db.session.create({
            data: {
              user: { connect: { id: user.id } },
              ip: data.ip,
              userAgent: data.userAgent,
            },
          });
        },
        valid() {
          return {
            expiresAt: {
              gt: new Date(),
            },
          };
        },
        async invalidate({ where }: { where: Prisma.SessionWhereUniqueInput }) {
          return await db.session.update({
            where,
            data: {
              expiresAt: new Date(),
            },
          });
        },
      },
      itemSpecification: {
        findOneByTags(...tags: string[]) {
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
          const tunic = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Equipment,
            tags.Torso
          );

          const trousers = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Equipment,
            tags.Legs
          );

          const shoes = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Equipment,
            tags.Feet
          );

          const pack = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Equipment,
            tags.Pack,
            tags.Storage
          );

          const gold = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Currency
          );

          const dagger = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Weapon
          );

          const food = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Food
          );

          const wine = await db.itemSpecification.findOneByTags(
            tags.Starting,
            tags.Drink
          );

          return {
            slots: {
              create: [
                { tags: [tags.Slot, tags.Head] },
                { tags: [tags.Slot, tags.Overgarment] },
                {
                  tags: [tags.Slot, tags.Torso],
                  items: {
                    create: { amount: 1, spec: { connect: { id: tunic.id } } },
                  },
                },
                { tags: [tags.Slot, tags.Waist] },
                { tags: [tags.Slot, tags.Hands] },
                {
                  tags: [tags.Slot, tags.Legs],
                  items: {
                    create: {
                      amount: 1,
                      spec: { connect: { id: trousers.id } },
                    },
                  },
                },
                {
                  tags: [tags.Slot, tags.Feet],
                  items: {
                    create: { amount: 1, spec: { connect: { id: shoes.id } } },
                  },
                },
                {
                  tags: [tags.Slot, tags.Pack],
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
              tags: { has: tags.Starting },
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
            where: { tags: { has: tags.Starting } },
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

        /**
         * Create new player character.
         */
        async createPlayer({
          data,
        }: {
          data: { name: string; description?: string; userId: number };
        }) {
          return await db.character.create({
            data: {
              name: data.name,
              description: data.description,
              user: { connect: { id: data.userId } },
              tags: [tags.Player, tags.Idle],
              ...(await db.character.startingLogs()),
              ...(await db.character.startingAttributes()),
              ...(await db.character.startingLocation()),
              ...(await db.character.startingSlots()),
            },
          });
        },

        async travel({
          data,
        }: {
          data: { userId: number; characterId: number; destinationId: number };
        }) {
          const destination = await db.location.findFirstOrThrow({
            where: { id: data.destinationId },
          });

          const character = await db.character.findFirstOrThrow({
            where: { id: data.characterId, user: { id: data.userId } },
            include: {
              attributes: { include: { spec: true } },
              location: {
                include: { routes: { include: { destinations: true } } },
              },
            },
          });

          if (
            !character.location.routes.some((route) =>
              route.destinations.some(
                (location) => location.id === destination.id
              )
            )
          ) {
            throw new Error(
              `Destination ${destination.name} is not reachable from ${character.location.name}.`
            );
          }

          if (character.status !== tags.Idle) {
            throw new Error("A character must be idle to travel.");
          }

          const stamina = ensure(
            character.attributes.find((attribute) =>
              attribute.spec.tags.includes(tags.Stamina)
            ),
            "Stamina attribute not found."
          );

          if (stamina.level < 1) {
            throw new Error("Not enough stamina to travel.");
          }

          await db.$transaction([
            db.character.update({
              where: { id: data.characterId, user: { id: data.userId } },
              data: {
                location: {
                  connect: { id: data.destinationId },
                },
              },
            }),

            db.attribute.update({
              where: { id: stamina.id },
              data: {
                level: {
                  decrement: 1,
                },
              },
            }),

            db.log.create({
              data: {
                character: { connect: { id: data.characterId } },
                message: `I have travelled from ${character.location.name} to ${destination.name}.`,
              },
            }),
          ]);
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
            const status = character.tags.find((tag) =>
              [
                tags.Idle,
                tags.Travelling,
                tags.Healing,
                tags.Resting,
                tags.Crafting,
                tags.Foraging,
                tags.Dead,
              ].includes(tag)
            );

            if (status) {
              return status;
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
            if (!container.tags.includes(tags.Slot)) {
              return null;
            }

            const slot = container.tags.find((tag) =>
              [
                tags.Head,
                tags.Overgarment,
                tags.Torso,
                tags.Waist,
                tags.Hands,
                tags.Legs,
                tags.Feet,
                tags.Pack,
              ].includes(tag)
            );

            if (slot) {
              return slot;
            }

            return tags.Unknown;
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

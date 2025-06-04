import { Prisma, PrismaClient } from "@prisma/client";
import type { PrismaClientOptions } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { applyDataMod } from "~/db/apply-data-mod";
import { isIndexable } from "~/lib/is-indexable";
import { getCharacterStatus, getSlotType, tag } from "~/lib/tag";

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

export type Action<T = unknown> = Prisma.Result<
  typeof db.action,
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

export type WithLocation<T = true> = {
  include: {
    location: T;
  };
};

export type WithSpec = {
  include: { spec: true };
};

export type WithAttributes = {
  include: { attributes: WithSpec };
};

export type WithSlots<T = WithItems> = {
  include: { slots: T };
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

export type WithRoutes<T = true> = {
  include: { routes: T };
};

export type WithUser = {
  include: { user: true };
};

export type WithCharacters = {
  include: { characters: true };
};

export type WithDestinations<T = true> = {
  include: { destinations: T };
};

export type WithStorage = {
  include: { items: WithSpec & { include: { storage: WithItems } } };
};

export type WithPopulation = {
  include: { _count: { select: { characters: true } } };
};

const defaultSessionDuration = { day: 1 };

const opts = {
  log: ["query", "info", "warn"],
} satisfies PrismaClientOptions;

const ext = Prisma.defineExtension((client) => {
  return client.$extends({
    model: {
      user: {
        /**
         * Find user by credentials.
         */
        async findByCredentials({
          data: { email, password },
        }: {
          data: { email: string; password: string };
        }) {
          const user = await db.user
            .findUniqueOrThrow({
              where: { email },
            })
            .catch((cause) => {
              throw new Error("E-mail not found.", { cause });
            });

          if (
            await bcrypt
              .compare(password, user.password)
              .then((match) => !match)
          ) {
            throw new Error("Password doesn't match.");
          }

          return user;
        },
      },
      session: {
        /**
         * Create new session by validating given credentials.
         */
        async createByCredentials({
          data: { email, password, ...data },
        }: {
          data: Omit<Prisma.SessionCreateInput, "user"> & {
            email: string;
            password: string;
          };
        }) {
          const user = await db.user.findByCredentials({
            data: { email, password },
          });

          return db.session.create({
            data: { ...data, user: { connect: { id: user.id } } },
          });
        },

        /**
         * Invalidate a session.
         */
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
        findManyByTags(...tags: string[]) {
          return db.itemSpecification.findMany({
            where: { tags: { hasEvery: tags } },
          });
        },
      },
      attributeSpecification: {
        findOneByTags(...tags: string[]) {
          return db.attributeSpecification.findFirstOrThrow({
            where: { tags: { hasEvery: tags } },
          });
        },
        findManyByTags(...tags: string[]) {
          return db.attributeSpecification.findMany({
            where: { tags: { hasEvery: tags } },
          });
        },
      },
      location: {
        findOneByTags(...tags: string[]) {
          return db.location.findFirstOrThrow({
            where: { tags: { hasEvery: tags } },
          });
        },
        findManyByTags(...tags: string[]) {
          return db.location.findMany({
            where: { tags: { hasEvery: tags } },
          });
        },
      },
      character: {
        /**
         * Create new player character.
         */
        async createPlayer({
          data,
        }: {
          data: { name: string; description?: string; userId: number };
        }) {
          const location = await db.location.findFirstOrThrow({
            where: { tags: { has: tag.Starting } },
          });

          const character = await db.character.create({
            data: {
              name: data.name,
              description: data.description,
              user: { connect: { id: data.userId } },
              tags: [tag.Player, tag.Idle],
              location: { connect: { id: location.id } },
            },
          });

          await db.log.create({
            data: {
              character: { connect: { id: character.id } },
              message: "I'm an adult now and I'm on my own.",
            },
          });

          const attributes = await db.attributeSpecification.findMany({
            where: {
              tags: { has: tag.Starting },
            },
          });

          for await (const spec of attributes) {
            await db.attribute.create({
              data: {
                character: { connect: { id: character.id } },
                spec: { connect: { id: spec.id } },
                level: spec.tags.includes(tag.Resource) ? 100 : 0,
              },
            });
          }

          const slots = {
            [tag.Head]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Head],
              },
            }),
            [tag.Overgarment]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Overgarment],
              },
            }),
            [tag.Torso]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Torso],
              },
            }),
            [tag.Waist]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Waist],
              },
            }),
            [tag.Hands]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Hands],
              },
            }),
            [tag.Legs]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Legs],
              },
            }),
            [tag.Feet]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Feet],
              },
            }),
            [tag.Pack]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tag.Slot, tag.Pack],
              },
            }),
          };

          await db.item.create({
            data: {
              container: { connect: { id: slots[tag.Torso].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Equipment, tag.Torso)
                    .then(({ id }) => id),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: slots[tag.Legs].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Equipment, tag.Legs)
                    .then(({ id }) => id),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: slots[tag.Feet].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Equipment, tag.Feet)
                    .then(({ id }) => id),
                },
              },
            },
          });

          const pack = await db.item.create({
            data: {
              container: { connect: { id: slots[tag.Pack].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Equipment, tag.Pack)
                    .then(({ id }) => id),
                },
              },
            },
          });

          const storage = await db.container.create({
            data: {
              source: { connect: { id: pack.id } },
              tags: [tag.Storage],
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Currency)
                    .then(({ id }) => id),
                },
              },
              amount: 10,
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Utility, tag.Resting)
                    .then(({ id }) => id),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Food)
                    .then(({ id }) => id),
                },
              },
              amount: 5,
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification
                    .findOneByTags(tag.Starting, tag.Weapon)
                    .then(({ id }) => id),
                },
              },
            },
          });

          return character;
        },

        /**
         * Check if an item is owned by a character.
         */
        async owns({
          data,
        }: {
          data: { characterId: number; itemId: number };
        }) {
          return await db.item
            .findFirst({
              select: { id: true },
              where: {
                id: data.itemId,
                container: {
                  OR: [
                    {
                      character: { id: data.characterId },
                    },
                    {
                      source: {
                        container: {
                          character: { id: data.characterId },
                        },
                      },
                    },
                  ],
                },
              },
            })
            .then((item) => !!item);
        },

        /**
         * Include character's equipment.
         */
        withEquipment() {
          return {
            slots: {
              include: {
                items: {
                  include: {
                    spec: true,
                    storage: {
                      include: { items: { include: { spec: true } } },
                    },
                  },
                },
              },
            },
          };
        },
      },
      item: {
        whereOwnedBy(characterId: number) {
          return {
            container: {
              OR: [
                { character: { id: characterId } },
                {
                  source: {
                    container: {
                      character: { id: characterId },
                    },
                  },
                },
              ],
            },
          };
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
                deletedAt: isIndexable(args.where, "deletedAt")
                  ? args.where.deletedAt
                  : null,
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
                deletedAt: isIndexable(args.where, "deletedAt")
                  ? args.where.deletedAt
                  : null,
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
                  data.expiresAt ??= DateTime.now()
                    .plus(defaultSessionDuration)
                    .toJSDate();
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
            return getCharacterStatus(character);
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
            return getSlotType(container);
          },
        },
      },
    },
  });
});

// Wrap with a function so we can have the client type, via ReturnType<T> without instancing it.
function createClient() {
  return new PrismaClient(opts).$extends(ext);
}
export type Client = ReturnType<typeof createClient>;

// Prisma client needs to be a singleton, otherwise it eventually exhausts the database connection pool due to code reload in development.
export const db =
  process.env.NODE_ENV === "production"
    ? createClient()
    : ((global as unknown as { db: Client }).db ??= createClient());

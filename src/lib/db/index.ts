import { Prisma, PrismaClient } from "@prisma/client";
import type {
  Operation,
  PrismaClientOptions,
} from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";
import { ensure } from "~/lib/ensure";
import { getSlotType, tags } from "~/lib/tags";

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
        /**
         * Create new session by validating given credentials.
         */
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
          const user = await db.user
            .findUniqueOrThrow({
              where: { email: data.email },
            })
            .catch((cause) => {
              throw new Error("E-mail not found.", { cause });
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

        /**
         * Invalidate sessions.
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
        async idByTag(...tags: string[]) {
          return (
            await db.itemSpecification.findFirstOrThrow({
              select: { id: true },
              where: { tags: { hasEvery: tags } },
            })
          ).id;
        },
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
            where: { tags: { has: tags.Starting } },
          });

          const character = await db.character.create({
            data: {
              name: data.name,
              description: data.description,
              user: { connect: { id: data.userId } },
              tags: [tags.Player, tags.Idle],
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
              tags: { has: tags.Starting },
            },
          });

          for await (const spec of attributes) {
            await db.attribute.create({
              data: {
                character: { connect: { id: character.id } },
                spec: { connect: { id: spec.id } },
                level: spec.tags.includes(tags.Resource) ? 100 : 0,
              },
            });
          }

          const slots = {
            [tags.Head]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Head],
              },
            }),
            [tags.Overgarment]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Overgarment],
              },
            }),
            [tags.Torso]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Torso],
              },
            }),
            [tags.Waist]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Waist],
              },
            }),
            [tags.Hands]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Hands],
              },
            }),
            [tags.Legs]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Legs],
              },
            }),
            [tags.Feet]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Feet],
              },
            }),
            [tags.Pack]: await db.container.create({
              data: {
                character: { connect: { id: character.id } },
                tags: [tags.Slot, tags.Pack],
              },
            }),
          };

          await db.item.create({
            data: {
              container: { connect: { id: slots[tags.Torso].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Equipment,
                    tags.Torso
                  ),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: slots[tags.Legs].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Equipment,
                    tags.Legs
                  ),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: slots[tags.Feet].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Equipment,
                    tags.Feet
                  ),
                },
              },
            },
          });

          const pack = await db.item.create({
            data: {
              container: { connect: { id: slots[tags.Pack].id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Equipment,
                    tags.Pack
                  ),
                },
              },
            },
          });

          const storage = await db.container.create({
            data: {
              // character: { connect: { id: character.id } },
              source: { connect: { id: pack.id } },
              tags: [tags.Storage],
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Currency
                  ),
                },
              },
              amount: 100,
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Utility,
                    tags.Resting
                  ),
                },
              },
            },
          });

          await db.item.create({
            data: {
              container: { connect: { id: storage.id } },
              spec: {
                connect: {
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Food
                  ),
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
                  id: await db.itemSpecification.idByTag(
                    tags.Starting,
                    tags.Weapon
                  ),
                },
              },
            },
          });

          return character;
        },

        async travel({
          data,
        }: {
          data: { characterId: number; destinationId: number };
        }) {
          const destination = await db.location
            .findFirstOrThrow({
              where: { id: data.destinationId },
            })
            .catch((cause) => {
              throw new Error(
                `Couldn't find destination (${data.destinationId}).`,
                { cause }
              );
            });

          const character = await db.character
            .findFirstOrThrow({
              where: { id: data.characterId },
              include: {
                attributes: { include: { spec: true } },
                location: {
                  include: { routes: { include: { destinations: true } } },
                },
              },
            })
            .catch((cause) => {
              throw new Error(
                `Couldn't find character (${data.characterId}).`,
                {
                  cause,
                }
              );
            });

          ensure(
            character.location.routes.some((route) =>
              route.destinations.some(
                (location) => location.id === destination.id
              )
            ),
            `Destination ${destination.name} is not reachable from ${character.location.name}.`
          );

          if (character.status !== tags.Idle) {
            throw new Error(`The character is busy (${character.status}).`);
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
              where: { id: data.characterId },
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

        async equip({
          data,
        }: {
          data: { characterId: number; itemId: number };
        }) {
          const item = await db.item
            .findFirstOrThrow({
              where: {
                id: data.itemId,
                spec: { tags: { has: tags.Equipment } },
              },
              include: { spec: true },
            })
            .catch((cause) => {
              throw new Error(`Couldn't find the item (${data.itemId}).`, {
                cause,
              });
            });

          const slot = await db.container
            .findFirstOrThrow({
              where: {
                character: { id: data.characterId },
                tags: { has: getSlotType(item.spec) },
              },
              include: {
                items: { include: { spec: true } },
              },
            })
            .catch((cause) => {
              throw new Error(`Couldn't find the slot for ${item.spec.name}.`, {
                cause,
              });
            });

          if (slot.items.length > 0) {
            await db.character.unequip({
              data: {
                characterId: data.characterId,
                itemId: slot.items[0].id,
              },
            });
          }

          await db.item.update({
            where: { id: data.itemId },
            data: {
              container: {
                connect: { id: slot.id },
              },
            },
          });
        },

        async unequip({
          data,
        }: {
          data: { characterId: number; itemId: number };
        }) {
          const storage = await db.container
            .findFirstOrThrow({
              where: {
                source: {
                  container: {
                    character: { id: data.characterId },
                    tags: { hasEvery: [tags.Slot, tags.Pack] },
                  },
                },
              },
            })
            .catch((cause) => {
              throw new Error(
                `Couldn't find the character's storage container.`,
                { cause }
              );
            });

          if (storage.sourceId === data.itemId) {
            throw new Error(`You wouldn't have where to put it.`);
          }

          await db.item.update({
            where: { id: data.itemId },
            data: {
              container: {
                connect: { id: storage.id },
              },
            },
          });
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

import { DateTime } from "luxon";
import { z } from "zod/v4";
import { Action, db } from "~/db";
import { getSlotType, getUtilityType, replace, tag } from "~/lib/tag";
import { schemas } from "~/lib/validation";
import {
  getStaminaRecoveryRate,
  getTravelDistance,
  getTravelDuration,
  getTravelStaminaCost,
} from "~/simulation/formula";
import { rate } from "~/simulation/rate";

export const actions = {
  rest: {
    /**
     * Start resting action.
     */
    async execute({
      itemId,
      characterId,
    }: {
      itemId: number;
      characterId: number;
    }) {
      const character = await db.character.findFirst({
        where: { id: characterId },
      });

      if (!character) {
        throw new Error(`Couldn't find character #${characterId}.`);
      }

      if (character.status !== tag.Idle) {
        throw new Error(`The character is busy (${character.status}).`);
      }

      const stamina = await db.attribute.findFirst({
        where: {
          characterId,
          spec: { tags: { has: tag.Stamina } },
        },
      });

      if (!stamina) {
        throw new Error(
          `Couldn't find stamina attribute for character #${character.id}.`
        );
      }

      if (stamina.level >= stamina.cap) {
        throw new Error(`You are already fully rested.`);
      }

      const item = await db.item.findFirst({
        where: { id: itemId, ...db.item.whereOwnedBy(character.id) },
        include: { spec: true },
      });

      if (!item) {
        throw new Error(`Couldn't find the item #${itemId}.`);
      }

      if (getUtilityType(item.spec) !== tag.Resting) {
        throw new Error(`You can't rest with that.`);
      }

      await db.$transaction([
        db.character.update({
          where: { id: character.id },
          data: {
            tags: replace(character.tags, [tag.Idle], [tag.Resting]),
          },
        }),

        db.log.create({
          data: {
            characterId,
            message: `I laid down to rest with my ${item.spec.name}.`,
          },
        }),

        db.action.create({
          data: {
            characterId,
            params: { itemId },
            tags: [tag.Resting],
          },
        }),
      ]);
    },

    /**
     * Tick resting action.
     */
    async tick(action: Action) {
      const { itemId } = z
        .object({
          itemId: schemas.id,
        })
        .parse(action.params);

      const { id: actionId, characterId } = action;

      const character = await db.character.findFirst({
        where: { id: characterId },
      });

      if (!character) {
        throw new Error(`Couldn't find character #${characterId}.`);
      }

      if (character.status !== tag.Resting) {
        throw new Error(`The character is not resting.`);
      }

      const stamina = await db.attribute.findFirst({
        where: {
          character: { id: character.id },
          spec: { tags: { has: tag.Stamina } },
        },
      });

      if (!stamina) {
        throw new Error(
          `Couldn't find stamina attribute for character #${character.id}.`
        );
      }

      const item = await db.item.findFirst({
        where: { id: itemId, ...db.item.whereOwnedBy(character.id) },
        include: { spec: true },
      });

      if (!item) {
        throw new Error(`Couldn't find the item #${itemId}.`);
      }

      const increment =
        getStaminaRecoveryRate({
          quality: item.quality,
        }).hourly / rate.hourly;

      const level = Math.min(stamina.level + increment, stamina.cap);

      if (level < stamina.cap) {
        await db.attribute.update({
          where: { id: stamina.id },
          data: { level },
        });
      } else {
        await db.$transaction([
          db.attribute.update({
            where: { id: stamina.id },
            data: { level: stamina.cap },
          }),

          db.character.update({
            where: { id: character.id },
            data: { tags: replace(character.tags, [tag.Resting], [tag.Idle]) },
          }),

          db.log.create({
            data: {
              character: { connect: { id: characterId } },
              message: `I have woken up feeling refreshed.`,
            },
          }),

          db.action.update({
            where: { id: actionId },
            data: { completedAt: new Date() },
          }),
        ]);
      }
    },
  },

  travel: {
    /**
     * Start travel action.
     */
    async execute({
      destinationId,
      characterId,
    }: {
      destinationId: number;
      characterId: number;
    }) {
      const character = await db.character.findFirst({
        where: { id: characterId },
        include: {
          attributes: { include: { spec: true } },
          location: {
            include: { routes: { include: { destinations: true } } },
          },
        },
      });

      if (!character) {
        throw new Error(`Couldn't find character #${characterId}.`);
      }

      if (character.status !== tag.Idle) {
        throw new Error(`The character is busy (${character.status}).`);
      }

      const stamina = character.attributes.find((attribute) =>
        attribute.spec.tags.includes(tag.Stamina)
      );

      if (!stamina) {
        throw new Error(
          `Stamina attribute wasn't found for character #${characterId}.`
        );
      }

      const endurance = character.attributes.find((attribute) =>
        attribute.spec.tags.includes(tag.Endurance)
      );

      if (!endurance) {
        throw new Error(
          `Endurance attribute wasn't found for character #${characterId}.`
        );
      }

      const destination = await db.location.findFirst({
        where: { id: destinationId },
      });

      if (!destination) {
        throw new Error(`Couldn't find destination #${destinationId}.`);
      }

      const route = character.location.routes.find((route) =>
        route.destinations.some((location) => location.id === destination.id)
      );

      if (!route) {
        throw new Error(
          `Destination ${destination.name} is not reachable from ${character.location.name}.`
        );
      }

      const distance = getTravelDistance({ destination, route });

      const cost = getTravelStaminaCost({
        distance,
        skill: endurance.level,
      });

      if (stamina.level < cost) {
        throw new Error("Not enough stamina to make this trip.");
      }

      await db.$transaction([
        db.character.update({
          where: { id: character.id },
          data: {
            location: { connect: { id: route.id } },
            tags: replace(character.tags, [tag.Idle], [tag.Travelling]),
          },
        }),

        db.attribute.update({
          where: { id: stamina.id },
          data: { level: { decrement: cost } },
        }),

        db.log.create({
          data: {
            character: { connect: { id: characterId } },
            message: `I departed ${character.location.name} towards ${destination.name} via ${route.name}.`,
          },
        }),

        db.action.create({
          data: {
            characterId,
            params: { destinationId },
            tags: [tag.Travel],
          },
        }),
      ]);
    },

    /**
     * Tick travel action.
     */
    async tick(action: Action) {
      const { id: actionId, startedAt, characterId } = action;

      const { destinationId } = z
        .object({ destinationId: schemas.id })
        .parse(action);

      const character = await db.character.findFirst({
        where: { id: characterId },
        include: {
          attributes: { include: { spec: true } },
          location: { include: { destinations: true } },
        },
      });

      if (!character) {
        throw new Error(`Couldn't find character #${characterId}.`);
      }

      if (character.status !== tag.Travelling) {
        throw new Error(`The character is not travelling.`);
      }

      const stamina = character.attributes.find((attribute) =>
        attribute.spec.tags.includes(tag.Stamina)
      );

      if (!stamina) {
        throw new Error(
          `Stamina attribute wasn't found for character #${characterId}.`
        );
      }

      const endurance = character.attributes.find((attribute) =>
        attribute.spec.tags.includes(tag.Endurance)
      );

      if (!endurance) {
        throw new Error(
          `Endurance attribute wasn't found for character #${characterId}.`
        );
      }

      const destination = await db.location.findFirst({
        where: { id: destinationId },
      });

      if (!destination) {
        throw new Error(`Couldn't find destination #${destinationId}.`);
      }

      if (
        !character.location.destinations.some(({ id }) => id === destinationId)
      ) {
        throw new Error(
          `Destination ${destination.name} is not reachable from ${character.location.name}.`
        );
      }

      const distance = getTravelDistance({
        destination,
        route: character.location,
      });

      const duration = getTravelDuration({
        distance,
        skill: endurance.level,
      });

      const completesAt = DateTime.fromJSDate(startedAt).plus(duration);

      if (DateTime.now() >= completesAt) {
        await db.$transaction([
          db.character.update({
            where: { id: character.id },
            data: {
              locationId: destinationId,
              tags: replace(character.tags, [tag.Travelling], [tag.Idle]),
            },
          }),

          db.log.create({
            data: {
              characterId,
              message: `I have arrived at ${destination.name}.`,
            },
          }),

          db.action.update({
            where: { id: actionId },
            data: { completedAt: new Date() },
          }),
        ]);
      }
    },
  },

  equip: {
    /**
     * Equip an item.
     */
    async execute({
      characterId,
      itemId,
    }: {
      characterId: number;
      itemId: number;
    }) {
      const item = await db.item.findFirst({
        where: {
          id: itemId,
        },
        include: { spec: true },
      });

      if (!item) {
        throw new Error(`Couldn't find the item (${itemId}).`);
      }

      if (!item.spec.tags.includes(tag.Equipment)) {
        throw new Error(`You can't equip that.`);
      }

      const slot = await db.container.findFirst({
        where: {
          characterId,
          tags: { has: getSlotType(item.spec) },
        },
        include: {
          items: { include: { spec: true } },
        },
      });

      if (!slot) {
        throw new Error(`Couldn't find the slot for ${item.spec.name}.`);
      }

      if (slot.items.length > 0) {
        throw new Error(`You have to take off what you're wearing first.`);
      }

      await db.item.update({
        where: { id: itemId },
        data: {
          containerId: slot.id,
        },
      });
    },
  },

  unequip: {
    /**
     * Take off an item.
     */
    async execute({
      characterId,
      itemId,
    }: {
      characterId: number;
      itemId: number;
    }) {
      const item = await db.item.findFirst({
        where: { id: itemId, ...db.item.whereOwnedBy(characterId) },
      });

      if (!item) {
        throw new Error(
          `Couldn't find item #${itemId} or it isn't owned by character #${characterId}.`
        );
      }

      const storage = await db.container.findFirst({
        where: {
          source: {
            container: {
              characterId,
              tags: { hasEvery: [tag.Slot, tag.Pack] },
            },
          },
        },
      });

      if (!storage) {
        throw new Error(
          `Couldn't find a storage container for character #${characterId}.`
        );
      }

      if (storage.sourceId === itemId) {
        throw new Error(`You wouldn't have where to store it.`);
      }

      await db.item.update({
        where: { id: itemId },
        data: {
          containerId: storage.id,
        },
      });
    },
  },

  discard: {
    /**
     * Discard an item.
     */
    async execute({
      characterId,
      itemId,
    }: {
      characterId: number;
      itemId: number;
    }) {
      const item = await db.item.findFirst({
        where: { id: itemId, ...db.item.whereOwnedBy(characterId) },
        include: { spec: true },
      });

      if (!item) {
        throw new Error(
          `Couldn't find item #${itemId} owned by character #${characterId}.`
        );
      }

      if (item.spec.tags.includes(tag.Stackable) && item.amount > 1) {
        await db.item.update({
          where: { id: itemId },
          data: { amount: { decrement: 1 } },
        });
      } else {
        await db.item.delete({
          where: { id: itemId },
        });
      }
    },
  },
};

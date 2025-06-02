import { DateTime } from "luxon";
import { Action, db } from "~/db";
import { Emitter } from "~/lib/emitter";
import { ensure } from "~/lib/ensure";
import { isIndexable } from "~/lib/is-indexable";
import { replace, tag } from "~/lib/tags";
import { parse, schemas } from "~/lib/validation";
import {
  getRestingTime,
  getTravelDistance,
  getTravelStaminaCost,
  getTravelTime,
} from "~/simulation/formula";

export const emitter = new Emitter();

/**
 * Validate action argument.
 */
emitter.on([tag.Action], async (action: unknown) => {
  if (!isIndexable(action, "params")) {
    throw new Error("Expected an action as argument.");
  }

  if (!isIndexable(action, "id") || typeof action.id !== "number") {
    throw new Error("Expected a persisted action as argument.");
  }
});

/**
 * Start resting action.
 */
emitter.on([tag.Action, tag.Resting, tag.Start], async (action: Action) => {
  const { itemId } = parse(action.params, {
    itemId: schemas.id,
  });

  const { characterId } = action;

  const character = await db.character
    .findFirstOrThrow({
      where: { id: characterId },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find character #${characterId}.`, {
        cause,
      });
    });

  if (character.status !== tag.Idle) {
    throw new Error(`The character is busy (${character.status}).`);
  }

  const stamina = await db.attribute
    .findFirstOrThrow({
      where: {
        character: { id: character.id },
        spec: { tags: { has: tag.Stamina } },
      },
    })
    .catch((cause) => {
      throw new Error(
        `Couldn't find stamina attribute for character #${character.id}.`,
        {
          cause,
        }
      );
    });

  if (stamina.level >= 100) {
    throw new Error(`You are already fully rested.`);
  }

  const item = await db.item
    .findFirstOrThrow({
      where: { id: itemId, ...db.item.whereOwnedBy(character.id) },
      include: { spec: true },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find the item #${itemId}.`, {
        cause,
      });
    });

  if (!item.spec.tags.includes(tag.Utility)) {
    throw new Error(`You can't rest with that.`);
  }

  if (!item.spec.tags.includes(tag.Resting)) {
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
        character: { connect: { id: character.id } },
        message: `I laid down to rest with my ${item.spec.name}.`,
      },
    }),
  ]);
});

/**
 * Tick resting action.
 */
emitter.on([tag.Action, tag.Resting, tag.Tick], async (action: Action) => {
  const { itemId } = parse(action.params, {
    itemId: schemas.id,
  });

  const { characterId } = action;

  const character = await db.character
    .findFirstOrThrow({
      where: { id: characterId },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find character #${characterId}.`, {
        cause,
      });
    });

  if (character.status !== tag.Resting) {
    throw new Error(`The character is not resting.`);
  }

  const stamina = await db.attribute
    .findFirstOrThrow({
      where: {
        character: { id: character.id },
        spec: { tags: { has: tag.Stamina } },
      },
    })
    .catch((cause) => {
      throw new Error(
        `Couldn't find stamina attribute for character #${character.id}.`,
        {
          cause,
        }
      );
    });

  const item = await db.item
    .findFirstOrThrow({
      where: { id: itemId },
      include: { spec: true },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find the item #${itemId}.`, {
        cause,
      });
    });

  const duration = getRestingTime({
    quality: item.quality,
    stamina: stamina.level,
  });

  const completesAt = DateTime.fromJSDate(action.startedAt).plus(duration);

  if (DateTime.now() >= completesAt) {
    await db.$transaction([
      db.attribute.updateMany({
        where: {
          character: { id: characterId },
          spec: { tags: { has: tag.Stamina } },
        },
        data: { level: 100 },
      }),

      db.character.update({
        where: { id: character.id },
        data: {
          tags: replace(character.tags, [tag.Resting], [tag.Idle]),
        },
      }),

      db.log.create({
        data: {
          character: { connect: { id: characterId } },
          message: `I have woken up feeling refreshed.`,
        },
      }),

      db.action.update({
        where: { id: action.id },
        data: {
          status: "completed",
        },
      }),
    ]);
  }
});

/**
 * Start travel action.
 */
emitter.on([tag.Action, tag.Travel, tag.Tick], async (action: Action) => {
  const { destinationId } = parse(action.params, {
    destinationId: schemas.id,
  });

  const { characterId } = action;

  const character = await db.character
    .findFirstOrThrow({
      where: { id: characterId },
      include: {
        attributes: { include: { spec: true } },
        location: {
          include: { routes: { include: { destinations: true } } },
        },
      },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find character #${characterId}.`, {
        cause,
      });
    });

  if (character.status !== tag.Idle) {
    throw new Error(`The character is busy (${character.status}).`);
  }

  const stamina = ensure(
    character.attributes.find((attribute) =>
      attribute.spec.tags.includes(tag.Stamina)
    ),
    `Stamina not found for character ${characterId}.`
  );

  const endurance = ensure(
    character.attributes.find((attribute) =>
      attribute.spec.tags.includes(tag.Endurance)
    ),
    `Endurance not found for character #${characterId}.`
  );

  const destination = await db.location
    .findFirstOrThrow({
      where: { id: destinationId },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find destination #${destinationId}.`, {
        cause,
      });
    });

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
    throw new Error("Not enough stamina to travel.");
  }

  await db.$transaction([
    db.character.update({
      where: { id: character.id },
      data: {
        location: {
          connect: { id: route.id },
        },
        tags: replace(character.tags, [tag.Idle], [tag.Travelling]),
      },
    }),

    db.attribute.update({
      where: { id: stamina.id },
      data: {
        level: {
          decrement: cost,
        },
      },
    }),

    db.log.create({
      data: {
        character: { connect: { id: characterId } },
        message: `I departed ${character.location.name} towards ${destination.name} via ${route.name}.`,
      },
    }),
  ]);
});

/**
 * Tick travel action.
 */
emitter.on([tag.Action, tag.Travel, tag.Tick], async (action: Action) => {
  const { destinationId } = parse(action.params, {
    destinationId: schemas.id,
  });

  const { characterId } = action;

  const character = await db.character
    .findFirstOrThrow({
      where: { id: characterId },
      include: {
        attributes: { include: { spec: true } },
        location: {
          include: { routes: { include: { destinations: true } } },
        },
      },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find character #${characterId}.`, {
        cause,
      });
    });

  if (character.status !== tag.Idle) {
    throw new Error(`The character is busy (${character.status}).`);
  }

  // const stamina = ensure(
  //   character.attributes.find((attribute) =>
  //     attribute.spec.tags.includes(tag.Stamina)
  //   ),
  //   `Stamina not found for character ${characterId}.`
  // );

  const endurance = ensure(
    character.attributes.find((attribute) =>
      attribute.spec.tags.includes(tag.Endurance)
    ),
    `Endurance not found for character #${characterId}.`
  );

  const destination = await db.location
    .findFirstOrThrow({
      where: { id: destinationId },
    })
    .catch((cause) => {
      throw new Error(`Couldn't find destination #${destinationId}.`, {
        cause,
      });
    });

  const route = character.location.routes.find((route) =>
    route.destinations.some((location) => location.id === destination.id)
  );

  if (!route) {
    throw new Error(
      `Destination ${destination.name} is not reachable from ${character.location.name}.`
    );
  }

  const distance = getTravelDistance({ destination, route });

  const duration = getTravelTime({
    distance,
    skill: endurance.level,
  });
  const completesAt = DateTime.fromJSDate(action.startedAt).plus(duration);

  if (DateTime.now() >= completesAt) {
    await db.$transaction([
      db.character.update({
        where: { id: character.id },
        data: {
          location: {
            connect: { id: destination.id },
          },
          tags: replace(character.tags, [tag.Travelling], [tag.Idle]),
        },
      }),

      db.log.create({
        data: {
          character: { connect: { id: characterId } },
          message: `I have arrived at ${destination.name}.`,
        },
      }),

      db.action.update({
        where: { id: action.id },
        data: {
          status: "completed",
        },
      }),
    ]);
  }
});

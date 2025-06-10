import { z } from "zod/v4";
import { db } from "~/db";
import {
  getTravelDistance,
  getTravelSpeed,
  getTravelStaminaCost,
} from "~/game/formula";
import { simulation } from "~/game/simulation";
import { rate } from "~/game/tick";
import { replace, tag } from "~/lib/tag";

simulation.on([tag.Travel], async (activity) => {
  const { destinationId } = z
    .object({ destinationId: z.number() })
    .parse(activity.params);
  const { characterId } = activity;

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
    endurance,
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

    db.log.create({
      data: {
        character: { connect: { id: characterId } },
        message: `I departed ${character.location.name} towards ${destination.name} via ${route.name}.`,
      },
    }),
  ]);
});

simulation.on([tag.Travel, tag.Tick], async (activity) => {
  const { characterId } = activity;
  const params = z
    .object({ destinationId: z.number(), progress: z.number() })
    .parse(activity.params);

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
    where: { id: params.destinationId },
  });

  if (!destination) {
    throw new Error(`Couldn't find destination #${params.destinationId}.`);
  }

  if (
    !character.location.destinations.some(
      ({ id }) => id === params.destinationId
    )
  ) {
    throw new Error(
      `Destination ${destination.name} is not reachable from ${character.location.name}.`
    );
  }

  const speed = getTravelSpeed({ endurance });

  const delta = speed * rate;

  const cost = getTravelStaminaCost({
    distance: delta,
    endurance,
  });

  const total = getTravelDistance({
    destination,
    route: character.location,
  });

  const progress = (params.progress * total + delta) / total;

  if (progress < 1) {
    await db.$transaction([
      db.attribute.update({
        where: { id: stamina.id },
        data: {
          level: Math.max(stamina.level - cost, 0),
        },
      }),

      db.activity.update({
        where: { id: activity.id },
        data: { params: { ...params, progress } },
      }),
    ]);
  } else {
    await db.$transaction([
      db.character.update({
        where: { id: character.id },
        data: {
          locationId: params.destinationId,
          tags: replace(character.tags, [tag.Travelling], [tag.Idle]),
        },
      }),

      db.attribute.update({
        where: { id: stamina.id },
        data: {
          level: Math.max(stamina.level - cost, 0),
        },
      }),

      db.log.create({
        data: {
          characterId,
          message: `I have arrived at ${destination.name}.`,
        },
      }),

      db.activity.update({
        where: { id: activity.id },
        data: { params: { ...params, progress: 1 }, completedAt: new Date() },
      }),
    ]);
  }
});

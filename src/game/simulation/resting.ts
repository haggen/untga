import z from "zod/v4";
import { db } from "~/db";
import { getStaminaRecoveryRate } from "~/game/formula";
import { rate } from "~/game/rate";
import { simulation } from "~/game/simulation";
import { getUtilityType, replace, tag } from "~/lib/tag";

simulation.on([tag.Resting], async (activity) => {
  const { characterId } = activity;
  const { itemId } = z.object({ itemId: z.number() }).parse(activity.params);

  const character = await db.character.findFirst({
    where: { id: activity.characterId },
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
        message: `I laid down to rest using my ${item.spec.name}.`,
      },
    }),
  ]);
});

simulation.on([tag.Resting, tag.Tick], async (activity) => {
  const { characterId } = activity;
  const { itemId } = z.object({ itemId: z.number() }).parse(activity.params);

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

      db.activity.update({
        where: { id: activity.id },
        data: { completedAt: new Date() },
      }),
    ]);
  }
});

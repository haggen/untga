import z from "zod/v4";
import { db } from "~/db";
import { simulation } from "~/game/simulation";
import { getUtilityType, tag } from "~/lib/tag";

simulation.on([tag.Equip], async (activity) => {
  const { itemId, characterId } = z
    .object({ itemId: z.number(), characterId: z.number() })
    .parse(activity.params);

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
      tags: { has: getUtilityType(item.spec) },
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
});

simulation.on([tag.Unequip], async (activity) => {
  const { itemId, characterId } = z
    .object({ itemId: z.number(), characterId: z.number() })
    .parse(activity.params);

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
});

simulation.on([tag.Discard], async (activity) => {
  const { itemId, characterId } = z
    .object({ itemId: z.number(), characterId: z.number() })
    .parse(activity.params);

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
});

import { db } from "@/lib/db";
import * as tags from "@/static/tags";

async function seed() {
  const village = await db.location.create({
    data: {
      name: "Village",
      description: "A small village.",
      tags: [tags.Peaceful, tags.StartingLocation],
    },
  });

  const forest = await db.location.create({
    data: {
      name: "Forest",
      description: "A dense forest.",
      tags: [tags.Hostile],
    },
  });

  await db.path.createMany({
    data: [
      {
        exitId: village.id,
        entryId: forest.id,
      },
      {
        exitId: forest.id,
        entryId: village.id,
      },
    ],
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Sword",
      description: "A sharp sword.",
      tags: [tags.Equipment, tags.Weapon],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Cap",
      description: "A leather cap.",
      tags: [tags.Equipment, tags.Head],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Apple",
      description: "A juicy apple.",
      tags: [tags.Food, tags.Consumable],
    },
  });

  const gold = await db.itemSpecification.create({
    data: {
      name: "Gold coin",
      description: "A gold coin.",
      tags: [tags.Currency],
    },
  });

  await db.itemSpecification.create({
    data: {
      name: "Backpack",
      description: "A backpack.",
      tags: [tags.Equipment, tags.Storage, tags.StartingEquipment],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Negotiation",
      description: "Skill to negotiate with others.",
      tags: [tags.Negotiation, tags.Skill],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Survivalship",
      description: "General ability to survive in the wild.",
      tags: [tags.Survivalship, tags.Skill],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Combat",
      description: "Ability to fight with hostiles.",
      tags: [tags.Combat, tags.Skill],
    },
  });

  await db.resourceSpecification.create({
    data: {
      name: "Health",
      description: "Health points.",
      tags: [tags.Health],
    },
  });

  await db.resourceSpecification.create({
    data: {
      name: "Stamina",
      description: "Stamina points.",
      tags: [tags.Stamina],
    },
  });

  await db.character.create({
    data: {
      name: "Jeremia, the villager",
      location: { connect: { id: village.id } },
      tags: [tags.NPC],

      ...(await db.character.withSlots({
        items: {
          create: [{ spec: { connect: { id: gold.id } }, amount: 1000 }],
        },
      })),
      ...(await db.character.withAttributes()),
      ...(await db.character.withResources()),
    },
  });

  await db.character.create({
    data: {
      name: "Brian, the hunter",
      location: { connect: { id: forest.id } },
      tags: [tags.NPC],

      ...(await db.character.withSlots({
        items: {
          create: [{ spec: { connect: { id: gold.id } }, amount: 1000 }],
        },
      })),
      ...(await db.character.withAttributes()),
      ...(await db.character.withResources()),
    },
  });
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

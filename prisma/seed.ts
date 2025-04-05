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
      tags: [tags.Contested],
    },
  });

  await db.route.createMany({
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
      name: "Crude knife",
      description: "A crude knife.",
      tags: [tags.Weapon],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Straw hat",
      description: "A simple hat made of straw.",
      tags: [tags.Equipment, tags.Head],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Plain shirt",
      description: "A simple and plain shirt.",
      tags: [tags.Equipment, tags.Chest],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Linen sash",
      description: "A sash made of linen.",
      tags: [tags.Equipment, tags.Waist, tags.Storage],
    },
  });

  await db.itemSpecification.createMany({
    data: {
      name: "Linen pants",
      description: "A pair of pants made of linen.",
      tags: [tags.Equipment, tags.Legs],
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
      name: "Leather backpack",
      description: "A leather backpack.",
      tags: [
        tags.Equipment,
        tags.Backpack,
        tags.Storage,
        tags.StartingEquipment,
      ],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Negotiation",
      description: "The ability to negotiate with others.",
      tags: [tags.Skill, tags.Negotiation],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Survivalship",
      description: "The ability to survive in the wild.",
      tags: [tags.Skill, tags.Survivalship],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Combat",
      description: "The ability to fight with hostiles.",
      tags: [tags.Skill, tags.Combat],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Health",
      description: "Health points.",
      tags: [tags.Resource, tags.Health],
    },
  });

  await db.attributeSpecification.create({
    data: {
      name: "Stamina",
      description: "Stamina points.",
      tags: [tags.Resource, tags.Stamina],
    },
  });

  await db.character.create({
    data: {
      name: "Jeremia, the villager",
      location: { connect: { id: village.id } },
      tags: [tags.NPC],
      ...(await db.character.startingSlots({
        items: {
          create: [{ spec: { connect: { id: gold.id } }, amount: 1000 }],
        },
      })),
      ...(await db.character.startingAttributes()),
    },
  });

  await db.character.create({
    data: {
      name: "Brian, the hunter",
      location: { connect: { id: forest.id } },
      tags: [tags.NPC],
      ...(await db.character.startingSlots({
        items: {
          create: [{ spec: { connect: { id: gold.id } }, amount: 1000 }],
        },
      })),
      ...(await db.character.startingAttributes()),
    },
  });
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

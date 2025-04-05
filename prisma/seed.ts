import { db } from "@/lib/db";
import * as tags from "@/static/tags";

async function seed() {
  const locations = {
    village: await db.location.create({
      data: {
        name: "Village",
        description: "A small village.",
        tags: [tags.Peaceful, tags.StartingLocation],
      },
    }),

    forest: await db.location.create({
      data: {
        name: "Forest",
        description: "A dense forest.",
        tags: [tags.Contested],
      },
    }),
  };

  await db.route.createMany({
    data: [
      {
        exitId: locations.village.id,
        entryId: locations.forest.id,
      },
      {
        exitId: locations.forest.id,
        entryId: locations.village.id,
      },
    ],
  });

  const items = {
    crudeKnife: await db.itemSpecification.createMany({
      data: {
        name: "Crude knife",
        description: "A crude knife.",
        tags: [tags.Weapon],
      },
    }),

    strawHat: await db.itemSpecification.createMany({
      data: {
        name: "Straw hat",
        description: "A simple hat made of straw.",
        tags: [tags.Equipment, tags.Head],
      },
    }),

    plainShirt: await db.itemSpecification.createMany({
      data: {
        name: "Plain shirt",
        description: "A simple and plain shirt.",
        tags: [tags.Equipment, tags.Chest],
      },
    }),

    linenSash: await db.itemSpecification.createMany({
      data: {
        name: "Linen sash",
        description: "A sash made of linen.",
        tags: [tags.Equipment, tags.Waist, tags.Storage],
      },
    }),

    linenPants: await db.itemSpecification.createMany({
      data: {
        name: "Linen pants",
        description: "A pair of pants made of linen.",
        tags: [tags.Equipment, tags.Legs],
      },
    }),

    leatherShoes: await db.itemSpecification.createMany({
      data: {
        name: "Leather shoes",
        description: "A pair of shoes made of leather.",
        tags: [tags.Equipment, tags.Feet],
      },
    }),

    apple: await db.itemSpecification.createMany({
      data: {
        name: "Apple",
        description: "A juicy apple.",
        tags: [tags.Food, tags.Consumable],
      },
    }),

    gold: await db.itemSpecification.create({
      data: {
        name: "Gold coin",
        description: "A gold coin.",
        tags: [tags.Currency],
      },
    }),

    backpack: await db.itemSpecification.create({
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
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const skills = {
    negotiation: await db.attributeSpecification.create({
      data: {
        name: "Negotiation",
        description: "The ability to negotiate with others.",
        tags: [tags.Player, tags.NPC, tags.Skill, tags.Negotiation],
      },
    }),

    survivalship: await db.attributeSpecification.create({
      data: {
        name: "Survivalship",
        description: "The ability to survive in the wild.",
        tags: [tags.Player, tags.NPC, tags.Skill, tags.Survivalship],
      },
    }),

    combat: await db.attributeSpecification.create({
      data: {
        name: "Combat",
        description: "Combat know-how and technique.",
        tags: [tags.Player, tags.NPC, tags.Skill, tags.Combat],
      },
    }),

    crafting: await db.attributeSpecification.create({
      data: {
        name: "Crafting",
        description: "The ability to craft items.",
        tags: [tags.Player, tags.NPC, tags.Skill, tags.Crafting],
      },
    }),

    foraging: await db.attributeSpecification.create({
      data: {
        name: "Foraging",
        description: "The ability to forage for resources.",
        tags: [tags.Player, tags.NPC, tags.Skill, tags.Foraging],
      },
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const attributes = {
    health: await db.attributeSpecification.create({
      data: {
        name: "Health",
        description: "Health points.",
        tags: [tags.Player, tags.NPC, tags.Resource, tags.Health],
      },
    }),

    stamina: await db.attributeSpecification.create({
      data: {
        name: "Stamina",
        description: "Stamina points.",
        tags: [tags.Player, tags.NPC, tags.Resource, tags.Stamina],
      },
    }),
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const npc = {
    jeremia: await db.character.create({
      data: {
        name: "Jeremia, the villager",
        location: { connect: { id: locations.village.id } },
        tags: [tags.NPC],
        ...(await db.character.startingSlots({
          items: {
            create: [
              { spec: { connect: { id: items.gold.id } }, amount: 1000 },
            ],
          },
        })),
        ...(await db.character.startingAttributes()),
      },
    }),

    brian: await db.character.create({
      data: {
        name: "Brian, the hunter",
        location: { connect: { id: locations.forest.id } },
        tags: [tags.NPC],
        ...(await db.character.startingSlots({
          items: {
            create: [
              { spec: { connect: { id: items.gold.id } }, amount: 1000 },
            ],
          },
        })),
        ...(await db.character.startingAttributes()),
      },
    }),
  };
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

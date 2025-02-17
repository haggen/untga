import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  const places = [
    await db.location.create({
      data: {
        name: "Village",
        description: "A small village.",
        container: { create: {} },
        tags: ["peaceful", "starting-location"],
      },
    }),
    await db.location.create({
      data: {
        name: "Forest",
        description: "A dense forest.",
        container: { create: {} },
        tags: ["hostile"],
      },
    }),
  ];

  await db.character.create({
    data: {
      name: "Jeremia, a concerned villager",
      location: { connect: { id: places[0].id } },
      container: { create: {} },
      tags: ["npc"],
    },
  });

  await db.character.create({
    data: {
      name: "Brian, the hunter",
      location: { connect: { id: places[1].id } },
      container: { create: {} },
      tags: ["npc"],
    },
  });

  await db.path.createMany({
    data: [
      {
        exitId: places[0].id,
        entryId: places[1].id,
      },
      {
        exitId: places[1].id,
        entryId: places[0].id,
      },
    ],
  });

  await db.attributeSpecification.createMany({
    data: [
      {
        name: "Energy",
        description: "Energy is spent to perform certain actions.",
        tags: ["energy", "playable-character-attribute"],
      },
    ],
  });
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const db = new PrismaClient();

async function seed() {
  await db.user.create({
    data: {
      email: "me@example.com",
      password: await bcrypt.hash("password-123", 10),
    },
  });

  const places = [
    await db.location.create({
      data: {
        name: "Village",
        description: "A simple village.",
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
      locationId: places[0].id,
      containerId: (await db.container.create({ data: {} })).id,
    },
  });

  await db.character.create({
    data: {
      name: "Brian, the hunter",
      locationId: places[1].id,
      containerId: (await db.container.create({ data: {} })).id,
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

  await db.attributeSpecification.create({
    data: {
      name: "Survival",
      description: "The ability to survive in the wild.",
      tags: ["playable-character-attribute"],
    },
  });
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

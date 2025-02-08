import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: "me@example.com",
      password: await bcrypt.hash("password-123", 10),
    },
  });
  await prisma.tick.create({
    data: {
      delta: 0,
      elapsed: 0,
    },
  });
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());

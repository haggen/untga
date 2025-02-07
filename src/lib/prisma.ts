import { PrismaClient } from "@prisma/client";

export type { Character, Session, User } from "@prisma/client";

export const prisma = new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  (global as unknown as { prisma: typeof prisma }).prisma = prisma;
}

export default prisma;

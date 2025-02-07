"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { DateTime } from "luxon";

export async function findUserByCredentials(data: {
  email: string;
  password: string;
}) {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: data.email },
  });

  if (!(await bcrypt.compare(data.password, user.password))) {
    throw new Error("Password doesn't match");
  }

  return user;
}

export async function createSession(data: { userId: number }) {
  return await prisma.session.create({
    data: {
      user: { connect: { id: data.userId } },
      expiresAt: DateTime.now().plus({ hour: 24 }).toJSDate(),
    },
  });
}

export async function createUser(data: { email: string; password: string }) {
  data.password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({ data });

  return user;
}

export async function createCharacter(data: { userId: number; name: string }) {
  return await prisma.character.create({
    data: {
      name: data.name,
      userId: data.userId,
    },
  });
}

export async function updateUser(data: {
  id: number;
  email?: string;
  password?: string;
}) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return await prisma.user.update({
    where: { id: data.id },
    data: {
      email: data.email,
      password: data.password,
    },
  });
}

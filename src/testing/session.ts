import { DateTime } from "luxon";
import { db } from "~/lib/db";

export async function createSession(userId: number) {
  return await db.session.create({
    data: {
      user: { connect: { id: userId } },
      ip: "",
      userAgent: "",
      expiresAt: DateTime.now().plus({ day: 1 }).toJSDate(),
    },
  });
}

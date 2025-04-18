import { createApiHandler } from "~/lib/api";
import { db } from "~/lib/db";

export const GET = createApiHandler(async () => {
  const locations = await db.location.findMany();

  return { payload: locations };
});

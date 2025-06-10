import { db } from "~/db";
import { simulation } from "~/game/simulation";
import { tag } from "~/lib/tag";

/**
 * How many hours are simulated per game tick.
 */
export const rate = 1;

/**
 * Game tick.
 */
export async function tick() {
  const activities = await db.activity.findMany({
    where: { completedAt: null },
    orderBy: { startedAt: "asc" },
  });

  for await (const activity of activities) {
    try {
      await simulation.handle({
        ...activity,
        tags: [...activity.tags, tag.Tick],
      });
    } catch (err) {
      console.error(`Activity #${activity.id} failed`, err);
    }
  }
}

import { db } from "~/db";
import { getActionType, tag } from "~/lib/tag";
import { actions as sim } from "./actions";

export async function tick() {
  const actions = await db.action.findMany({
    where: { completedAt: null },
    orderBy: { startedAt: "asc" },
  });

  for await (const action of actions) {
    try {
      switch (getActionType(action)) {
        case tag.Resting:
          await sim.rest.tick(action);
          break;
        case tag.Travel:
          await sim.travel.tick(action);
          break;
        default:
          throw new Error(`Unknown type for action #${action.id}.`);
      }
    } catch (err) {
      console.error(`Action #${action.id} failed`, err);
    }
  }
}

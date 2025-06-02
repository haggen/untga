import { db } from "~/db";
import { tag } from "~/lib/tags";
import { sim } from "~/simulation";

let intervalId: NodeJS.Timeout | null = null;

export function register() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(async () => {
    const actions = await db.action.findMany({
      where: { status: "pending" },
      orderBy: { startedAt: "asc" },
    });

    for (const action of actions) {
      sim.emitter.emit([tag.Action, tag.Tick, ...action.tags], action);
    }
  }, 1000);
}

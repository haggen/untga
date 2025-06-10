import { DateTime } from "luxon";
import { db, type Activity } from "~/db";

/**
 * Game activity input data.
 */
export type Plan<T extends object = Record<string, unknown>> = {
  tags: string[];
  characterId: number;
  params: T;
};

/**
 * Game activity handler.
 */
type Handler = (activity: Activity) => Promise<void>;

/**
 * Create unique string for a set of tags.
 */
function key(tags: string[]) {
  return String(tags.toSorted()).toLowerCase();
}

/**
 * Activity based simulation.
 */
export const simulation = {
  handlers: new Map<string, Handler>(),

  /**
   * Register a new activity handler.
   */
  on(tags: string[], handler: Handler) {
    this.handlers.set(key(tags), handler);
  },

  /**
   * Handle game activity.
   */
  async handle(activity: Activity) {
    const handler = this.handlers.get(key(activity.tags));
    if (!handler) {
      throw new Error(`No handler found for tags ${activity.tags}.`);
    }

    try {
      return await handler(activity);
    } catch (err) {
      await db.activity.update({
        where: { id: activity.id },
        data: {
          completedAt: DateTime.now().toJSDate(),
        },
      });
      throw err;
    }
  },
};

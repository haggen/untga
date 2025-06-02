/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Event key.
 */
type Key = Set<string>;

/**
 * Event handler.
 */
type Handler = (...args: any[]) => Promise<void>;

/**
 * An emitter for tag-keyed events.
 */
export class Emitter {
  handlers: [Key, Handler][] = [];

  /**
   * Register a handler.
   */
  on(tags: string[], handler: Handler) {
    this.handlers = [
      ...this.handlers,
      [new Set(tags), handler] as [Key, Handler],
    ].toSorted((a, b) => a[0].size - b[0].size);
  }

  /**
   * Call all registered handlers that have at least these given tags.
   */
  async emit(tags: string[], ...args: any[]) {
    const emitted = new Set(tags);
    for (const [registered, handler] of this.handlers) {
      if (registered.isSubsetOf(emitted)) {
        await handler(...args);
      }
    }
  }
}

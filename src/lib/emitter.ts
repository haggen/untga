/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Event identifier.
 */
type Id = [string, ...string[]];

/**
 * Serialized event identifier.
 */
type StringId<E extends string[]> = E extends [infer T extends string]
  ? T
  : E extends [infer T extends string, ...infer U extends string[]]
  ? `${T},${StringId<U>}`
  : never;

/**
 * Event handler.
 */
type Handler<T extends any[] = any[]> = (...args: T) => Promise<void>;

/**
 * Event emitter.
 */
export class Emitter<M extends { [key: string]: any[] }> {
  handlers = new Map<string, Handler[]>();

  /**
   * Register an event handler and return extended emitter type.
   */
  on<I extends Id, A extends any[]>(type: I, handler: Handler<A>) {
    const key = String(type);
    const handlers = this.handlers.get(key) ?? [];
    handlers.push(handler);
    this.handlers.set(key, handlers);
    return this as Emitter<M & { [key in StringId<I>]: A }>;
  }

  /**
   * Emit an event.
   */
  async emit<T extends Id>(type: T, ...args: M[StringId<T>]) {
    const key = String(type);
    const handlers = this.handlers.get(key);

    if (!handlers?.length) {
      throw new Error(`No handlers registered for event ${key}.`);
    }

    for await (const handler of handlers) {
      await handler(...args);
    }
  }
}

/**
 * Guard that the value is an object and is indexable by the given key.
 */
export function isIndexable<T extends string | symbol | number>(
  object: unknown,
  key: T
): object is { [key in T]: unknown } {
  return typeof object === "object" && object !== null && key in object;
}
